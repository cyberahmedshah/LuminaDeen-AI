/* ============================================================
   NISAB.AI — JavaScript (Updated v3)
   Handles: Zakat calculation, accordions, FAQ, currency, UI,
            comma formatting, Nisab indicators, property logic,
            irrigation-based Ushr rates, Guide page support

   CHANGES FROM v2:
   1.  Req #1  — Thousand-comma formatting on all amount inputs
                 (type="text" + format-currency / format-decimal class)
   2.  Req #2  — Property field replaces Rental Income in Business
                 section; calculates Zakat based on property intent
                 (resale, rental, personal)
   3.  Req #3  — Irrigation type selector: Natural 10%, Artificial 5%,
                 Mixed 7.5%. Ushr auto-updates from dropdown.
   4.  Req #4  — Nisab threshold indicators below Gold, Cash/Assets,
                 Agriculture, and Property sections
   5.  Req #5  — FAQ #4 and #5 removed (done in HTML)
   6.  Req #6  — Guide page created (guide.html)
   7.  General — Better validation, input sanitisation, code quality
   ============================================================ */


/* =============================================================
   SECTION 1: CONSTANTS — Metal prices & Nisab weights
   ============================================================= */

/* Fallback gold/silver prices in USD per gram
   Used only when user has not entered a custom rate */
var DEFAULT_GOLD_PRICE_USD   = 87.48;
var DEFAULT_SILVER_PRICE_USD = 2.75;

/* Fixed Islamic Nisab weight thresholds (never change) */
var GOLD_NISAB_GRAMS   = 87.48;   /* grams of pure gold  */
var SILVER_NISAB_GRAMS = 612.36;  /* grams of pure silver */


/* =============================================================
   SECTION 2: SUPPORTED CURRENCIES
   ============================================================= */

var CURRENCIES = {
  USD: { symbol: "$",   name: "US Dollar",        rate: 1     },
  GBP: { symbol: "£",   name: "British Pound",     rate: 0.79  },
  EUR: { symbol: "€",   name: "Euro",              rate: 0.92  },
  AED: { symbol: "د.إ", name: "UAE Dirham",        rate: 3.67  },
  SAR: { symbol: "﷼",  name: "Saudi Riyal",        rate: 3.75  },
  PKR: { symbol: "₨",  name: "Pakistani Rupee",    rate: 278   },
  INR: { symbol: "₹",  name: "Indian Rupee",       rate: 83    },
  MYR: { symbol: "RM",  name: "Malaysian Ringgit", rate: 4.7   }
};


/* =============================================================
   SECTION 3: UTILITY FUNCTIONS
   ============================================================= */

/* getVal(id)
   Reads a text input field (with comma formatting) and returns
   its numeric value. Returns 0 if empty, non-numeric, or negative. */
function getVal(id) {
  var el = document.getElementById(id);
  if (!el) return 0;
  /* Strip commas before parsing — inputs now use comma-formatted strings */
  var raw = el.value.replace(/,/g, "");
  var v   = parseFloat(raw);
  return isNaN(v) || v < 0 ? 0 : v;
}

/* setVal(id, value)
   Sets a numeric input field value. Applies comma formatting for display.
   Clears the field (shows placeholder) when value is 0. */
function setVal(id, value) {
  var el = document.getElementById(id);
  if (!el) return;
  if (value > 0) {
    /* Format with commas for display */
    el.value = formatNumberWithCommas(Math.round(value * 100) / 100);
  } else {
    el.value = "";
  }
}

/* formatMoney(amount, currencyCode)
   Formats a number as a currency string with symbol, commas, and 2 dp.
   Example: formatMoney(12500, "PKR") → "₨12,500.00" */
function formatMoney(amount, currencyCode) {
  var cur     = CURRENCIES[currencyCode] || CURRENCIES["USD"];
  var symbol  = cur.symbol;
  var rounded = Math.round(amount * 100) / 100;
  var parts   = rounded.toFixed(2).split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return symbol + parts.join(".");
}

/* formatNumberWithCommas(num)
   Adds thousand-separator commas to a number or numeric string.
   Preserves decimal portion if present.
   Example: 1000000.5 → "1,000,000.5" */
function formatNumberWithCommas(num) {
  var str    = String(num);
  var parts  = str.split(".");
  parts[0]   = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

/* showToast(msg)
   Brief pop-up notification at the bottom of the screen (3s). */
function showToast(msg) {
  var toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(function () {
    toast.classList.remove("show");
  }, 3000);
}


/* =============================================================
   SECTION 4 (Req #1): COMMA FORMATTING ON AMOUNT INPUTS
   Attaches live formatting to all inputs with class
   "format-currency" or "format-decimal".
     - format-currency: treats input as monetary (no units prefix)
     - format-decimal:  allows decimals, used for weights in grams/kg
   ============================================================= */

/* applyCommaFormatting(input)
   Called on every "input" event for formatted fields.
   Strips commas, validates, then re-inserts commas. */
function applyCommaFormatting(input) {
  /* Remember caret position to restore it after reformatting */
  var selStart = input.selectionStart;
  var selEnd   = input.selectionEnd;
  var oldLen   = input.value.length;

  /* Strip all commas from the current value */
  var raw = input.value.replace(/,/g, "");

  /* Allow only digits and one decimal point */
  raw = raw.replace(/[^\d.]/g, "");

  /* Prevent multiple decimal points */
  var dotIndex = raw.indexOf(".");
  if (dotIndex !== -1) {
    raw = raw.slice(0, dotIndex + 1) + raw.slice(dotIndex + 1).replace(/\./g, "");
  }

  /* Apply comma formatting to the integer part only */
  var formatted;
  if (raw === "" || raw === ".") {
    formatted = raw; /* leave blank or leading dot as-is */
  } else {
    var parts  = raw.split(".");
    parts[0]   = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    formatted  = parts.join(".");
  }

  /* Update the field value */
  input.value = formatted;

  /* Restore caret accounting for added/removed commas */
  var newLen  = formatted.length;
  var diff    = newLen - oldLen;
  var newPos  = selStart + diff;
  if (newPos < 0) newPos = 0;
  try {
    input.setSelectionRange(newPos, newPos + (selEnd - selStart));
  } catch(e) { /* ignore range errors on some mobile browsers */ }
}

/* initCommaFormatting()
   Finds all .format-currency and .format-decimal inputs on the page
   and attaches the live formatting handler. */
function initCommaFormatting() {
  var inputs = document.querySelectorAll(".format-currency, .format-decimal");
  inputs.forEach(function(input) {
    input.addEventListener("input", function() {
      applyCommaFormatting(this);
    });
  });
}


/* =============================================================
   SECTION 5: CURRENCY PREFIX UPDATE
   ============================================================= */

function updateCurrencyPrefixes() {
  var currencyCode = document.getElementById("currency").value;
  var cur          = CURRENCIES[currencyCode] || CURRENCIES["USD"];

  /* All currency-symbol prefix spans in the form */
  var prefixIds = [
    "prefix1", "prefix2", "prefix3",
    "prefix4", "prefix4b",             /* gold price + total gold value */
    "prefix5", "prefix5a",             /* silver price + total silver value */
    "prefix6", "prefix7",              /* agriculture: price/kg + crops value */
    "prefix10", "prefix11",
    "prefix13", "prefix15",            /* business fields */
    "nisabRatePrefix"
  ];

  prefixIds.forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.textContent = cur.symbol;
  });
}


/* =============================================================
   SECTION 6: NISAB RATE FIELD — label & placeholder
   ============================================================= */

function updateNisabRateField() {
  var nisabType    = document.getElementById("nisabType").value;
  var currencyCode = document.getElementById("currency").value;
  var cur          = CURRENCIES[currencyCode] || CURRENCIES["USD"];
  var rate         = cur.rate;

  var label  = document.getElementById("nisabRateLabel");
  var input  = document.getElementById("nisabRateInput");
  var prefix = document.getElementById("nisabRatePrefix");

  if (prefix) prefix.textContent = cur.symbol;

  if (nisabType === "gold") {
    var goldLocalApprox = (DEFAULT_GOLD_PRICE_USD * rate).toFixed(2);
    if (label) label.textContent = "Current Gold Price (per gram, in " + currencyCode + ")";
    if (input) input.placeholder = "e.g. ≈ " + goldLocalApprox + " " + currencyCode;
  } else {
    var silverLocalApprox = (DEFAULT_SILVER_PRICE_USD * rate).toFixed(2);
    if (label) label.textContent = "Current Silver Price (per gram, in " + currencyCode + ")";
    if (input) input.placeholder = "e.g. ≈ " + silverLocalApprox + " " + currencyCode;
  }
}


/* =============================================================
   SECTION 7: RESET ALL FIELDS
   Called on currency or nisab type change.
   ============================================================= */

function resetAllFields() {
  /* Clear every input (type="text") in the calculator form */
  var inputs = document.querySelectorAll(".calculator-form .form-input");
  inputs.forEach(function (input) {
    input.value = "";
    input.classList.remove("input-error"); /* clear any validation errors */
  });

  /* Hide results, show placeholder */
  hideResults();

  /* Clear Nisab indicators */
  clearAllNisabIndicators();
}


/* =============================================================
   SECTION 8: GOLD KARAT LABEL UPDATE
   ============================================================= */

function updateGoldKaratLabel() {
  var karat = document.getElementById("goldKarat").value;
  var label = document.getElementById("goldPriceLabel");
  if (label) label.textContent = "Gold Price per Gram (" + karat + "K)";
}


/* =============================================================
   SECTION 9: AUTO-CALCULATION HELPERS
   ============================================================= */

/* Req #4: autoCalcGoldValue — triggered on goldGrams or goldPricePerGram change */
function autoCalcGoldValue() {
  var grams = getVal("goldGrams");
  var price = getVal("goldPricePerGram");
  var total = grams * price;
  setVal("goldValue", total);
  /* Update Nisab indicator for Gold section */
  updateGoldNisabIndicator();
}

/* autoCalcSilverValue — triggered on silverGrams or silverPricePerGram change */
function autoCalcSilverValue() {
  var grams = getVal("silverGrams");
  var price = getVal("silverPricePerGram");
  var total = grams * price;
  setVal("silverValue", total);
  /* Combine gold+silver for Nisab indicator */
  updateGoldNisabIndicator();
}

/* autoCalcCropsValue — triggered on cropQuantityKg or cropPricePerKg change */
function autoCalcCropsValue() {
  var qty   = getVal("cropQuantityKg");
  var price = getVal("cropPricePerKg");
  var total = qty * price;
  setVal("cropsValue", total);
  /* Update Ushr hint text to show calculated Ushr amount */
  updateUshrHint(total);
  /* Update Agriculture Nisab indicator */
  updateAgriNisabIndicator(total);
}


/* =============================================================
   SECTION 10 (Req #3): IRRIGATION TYPE — USHR RATE LOGIC
   Three rates: Natural 10% | Artificial 5% | Mixed 7.5%
   ============================================================= */

/* getUshrRate()
   Returns the applicable Ushr decimal rate based on irrigation type. */
function getUshrRate() {
  var irrigationType = document.getElementById("irrigationType");
  if (!irrigationType) return 0.10; /* default: natural */
  var type = irrigationType.value;
  if (type === "artificial") return 0.05;
  if (type === "mixed")      return 0.075;
  return 0.10; /* natural (default) */
}

/* updateUshrRate()
   Called on irrigation type dropdown change.
   Updates the visible rate badge and recalculates if results are shown. */
function updateUshrRate() {
  var rate      = getUshrRate();
  var rateText  = document.getElementById("ushrRateText");
  var ratePct   = Math.round(rate * 1000) / 10; /* e.g. 0.075 → 7.5 */
  var type      = document.getElementById("irrigationType").value;
  var typeLabel = type === "artificial" ? "Artificial Irrigation"
                : type === "mixed"      ? "Mixed Irrigation"
                : "Natural Irrigation";

  if (rateText) {
    rateText.innerHTML = "Applicable Ushr Rate: <strong>" + ratePct + "%</strong> (" + typeLabel + ")";
  }

  /* Update the hint text below the Crops Value field */
  var cropsVal = getVal("cropsValue");
  updateUshrHint(cropsVal);

  /* Live-recalculate if results already displayed */
  liveRecalcIfOpen();
}

/* updateUshrHint(cropsValue)
   Updates the hint below Crops Value field to show the calculated Ushr amount. */
function updateUshrHint(cropsVal) {
  var hint = document.getElementById("cropsUshrHint");
  if (!hint) return;
  var rate    = getUshrRate();
  var ratePct = Math.round(rate * 1000) / 10;
  if (cropsVal > 0) {
    var currencyCode = document.getElementById("currency") ? document.getElementById("currency").value : "PKR";
    var ushrAmt = cropsVal * rate;
    hint.textContent = "Auto-filled (quantity × price). Ushr (" + ratePct + "%) = " + formatMoney(ushrAmt, currencyCode) + " will be added to Zakat due.";
  } else {
    hint.textContent = "Auto-filled (quantity × price). Ushr (" + ratePct + "%) will be applied on this value.";
  }
}


/* =============================================================
   SECTION 11 (Req #4): NISAB THRESHOLD INDICATORS
   Show a coloured indicator below each relevant section.
   Green = above threshold | Red = below threshold (warning style)
   ============================================================= */

/* getCurrentNisabThreshold()
   Calculates and returns the Nisab threshold in the selected currency.
   This is a shared helper used by all indicator updaters. */
function getCurrentNisabThreshold() {
  var currencyCode = document.getElementById("currency") ? document.getElementById("currency").value : "PKR";
  var nisabType    = document.getElementById("nisabType") ? document.getElementById("nisabType").value : "silver";
  var cur          = CURRENCIES[currencyCode] || CURRENCIES["USD"];
  var rate         = cur.rate;

  var customRate = getVal("nisabRateInput");

  var goldPriceLocal, silverPriceLocal;
  if (nisabType === "gold") {
    goldPriceLocal   = customRate > 0 ? customRate : DEFAULT_GOLD_PRICE_USD * rate;
    silverPriceLocal = DEFAULT_SILVER_PRICE_USD * rate;
  } else {
    silverPriceLocal = customRate > 0 ? customRate : DEFAULT_SILVER_PRICE_USD * rate;
    goldPriceLocal   = DEFAULT_GOLD_PRICE_USD * rate;
  }

  var nisabThreshold = (nisabType === "gold")
    ? GOLD_NISAB_GRAMS   * goldPriceLocal
    : SILVER_NISAB_GRAMS * silverPriceLocal;

  return { threshold: nisabThreshold, currencyCode: currencyCode };
}

/* renderNisabIndicator(indicatorId, value, label)
   Shows/hides and styles a .nisab-indicator element based on value vs threshold. */
function renderNisabIndicator(indicatorId, value, label) {
  var el = document.getElementById(indicatorId);
  if (!el) return;

  if (value <= 0) {
    el.style.display = "none";
    return;
  }

  var info      = getCurrentNisabThreshold();
  var threshold = info.threshold;
  var currency  = info.currencyCode;

  el.style.display = "flex";
  el.innerHTML = "";

  var iconSpan = document.createElement("span");
  iconSpan.className = "nisab-indicator-icon";

  var textSpan = document.createElement("span");

  if (value >= threshold) {
    /* Above Nisab — green */
    el.className = "nisab-indicator above-nisab";
    iconSpan.textContent = "✅";
    textSpan.textContent = label + " (" + formatMoney(value, currency) + ") exceeds the Nisab threshold of " + formatMoney(threshold, currency) + ". Zakat is applicable.";
  } else {
    /* Below Nisab — red warning style */
    el.className = "nisab-indicator below-nisab";
    iconSpan.textContent = "⚠️";
    textSpan.textContent = label + " (" + formatMoney(value, currency) + ") is below the Nisab threshold of " + formatMoney(threshold, currency) + ". Zakat may not be obligatory for this category alone.";
  }

  el.appendChild(iconSpan);
  el.appendChild(textSpan);
}

/* clearAllNisabIndicators() — hides all on reset */
function clearAllNisabIndicators() {
  var ids = ["cashNisabIndicator", "goldNisabIndicator", "agriNisabIndicator", "propertyNisabIndicator"];
  ids.forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.style.display = "none";
  });
}

/* Individual Nisab indicator updaters */
function updateCashNisabIndicator() {
  var total = getVal("cashHome") + getVal("bankBalance") + getVal("savingsAccount");
  renderNisabIndicator("cashNisabIndicator", total, "Cash & Bank total");
}

function updateGoldNisabIndicator() {
  var goldVal   = getVal("goldValue")   || (getVal("goldGrams") * getVal("goldPricePerGram"));
  var silverVal = getVal("silverValue") || (getVal("silverGrams") * getVal("silverPricePerGram"));
  var total = goldVal + silverVal;
  renderNisabIndicator("goldNisabIndicator", total, "Gold & Silver total");
}

function updateAgriNisabIndicator(cropsVal) {
  var val = (cropsVal !== undefined) ? cropsVal : getVal("cropsValue");
  renderNisabIndicator("agriNisabIndicator", val, "Crops value");
}

function updatePropertyNisabIndicator() {
  var intent = document.getElementById("propertyIntent");
  var val    = getVal("propertyValue");
  /* Personal use property is never zakatable */
  if (intent && intent.value === "personal") {
    var el = document.getElementById("propertyNisabIndicator");
    if (el) {
      el.style.display = "flex";
      el.className = "nisab-indicator";
      el.style.background = "#f8f7f3";
      el.style.border = "1px solid #e8e4dc";
      el.style.color = "#888";
      el.innerHTML = '<span class="nisab-indicator-icon">🏠</span><span>Personal-use property is exempt from Zakat.</span>';
    }
    return;
  }
  renderNisabIndicator("propertyNisabIndicator", val, "Investment property");
}


/* =============================================================
   SECTION 12: ACCORDIONS & FAQ
   ============================================================= */

function initAccordions() {
  var headers = document.querySelectorAll(".category-header");

  headers.forEach(function (header) {
    var targetId = header.getAttribute("data-target");
    var body     = document.getElementById(targetId);
    var toggle   = header.querySelector(".category-toggle");

    /* Open Cash & Bank by default */
    if (targetId === "cashAssets") {
      body.classList.add("open");
      toggle.classList.add("open");
    }

    header.addEventListener("click", function () {
      var isOpen = body.classList.contains("open");
      if (isOpen) {
        body.classList.remove("open");
        toggle.classList.remove("open");
      } else {
        body.classList.add("open");
        toggle.classList.add("open");
      }
    });
  });
}

function initFAQ() {
  var questions = document.querySelectorAll(".faq-question");

  questions.forEach(function (btn) {
    var targetId = btn.getAttribute("data-target");
    var answer   = document.getElementById(targetId);
    var arrow    = btn.querySelector(".faq-arrow");
    if (!answer) return; /* guard: removed FAQ items won't have an element */

    btn.addEventListener("click", function () {
      var isOpen = answer.classList.contains("open");

      /* Close all open answers */
      document.querySelectorAll(".faq-answer").forEach(function (a) { a.classList.remove("open"); });
      document.querySelectorAll(".faq-arrow").forEach(function (a)  { a.classList.remove("open"); });

      if (!isOpen) {
        answer.classList.add("open");
        arrow.classList.add("open");
      }
    });
  });
}


/* =============================================================
   SECTION 13: HAMBURGER MOBILE MENU
   ============================================================= */

function initHamburger() {
  var btn  = document.getElementById("hamburgerBtn");
  var menu = document.getElementById("mobileMenu");
  if (!btn || !menu) return;

  btn.addEventListener("click", function () {
    menu.classList.toggle("open");
  });

  menu.querySelectorAll(".mobile-link").forEach(function (link) {
    link.addEventListener("click", function () {
      menu.classList.remove("open");
    });
  });
}


/* =============================================================
   SECTION 14: NAVBAR "CALCULATE ZAKAT" BUTTON
   ============================================================= */

function initNavCTA() {
  var btn = document.getElementById("navCalculateBtn");
  if (!btn) return;
  btn.addEventListener("click", function () {
    var el = document.getElementById("calculator");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  });
}


/* =============================================================
   SECTION 15: RESULTS PANEL HELPERS
   ============================================================= */

function hideResults() {
  var content     = document.getElementById("resultsContent");
  var placeholder = document.getElementById("resultsPlaceholder");
  if (content)     content.style.display     = "none";
  if (placeholder) placeholder.style.display = "block";
}


/* =============================================================
   SECTION 16 (Req #2): PROPERTY ZAKAT CALCULATION
   Intent: resale → 2.5% of market value
           rental  → 2.5% of market value (stored rental income is the
                      value entered; user should enter accumulated income)
           personal → 0% (exempt)
   ============================================================= */

function getPropertyZakatValue() {
  var intent = document.getElementById("propertyIntent");
  var val    = getVal("propertyValue");

  if (!intent || val <= 0) return { zakatableValue: 0, label: "🏠 Property" };

  var intentVal = intent.value;

  if (intentVal === "personal") {
    /* Personal use — exempt */
    return { zakatableValue: 0, label: "🏠 Property (Personal — Exempt)" };
  } else if (intentVal === "rental") {
    /* Rental: Zakat on accumulated net rental income (the value entered) */
    return { zakatableValue: val, label: "🏘️ Rental Property Income" };
  } else {
    /* Resale: Zakat on full market value */
    return { zakatableValue: val, label: "🏗️ Investment Property (Resale)" };
  }
}


/* =============================================================
   SECTION 17: MAIN ZAKAT CALCULATOR
   Steps:
     1.  Read currency & nisab type
     2.  Determine metal prices (custom or default)
     3.  Calculate Nisab threshold
     4.  Collect Cash & Bank
     5.  Collect Gold & Silver
     6.  Collect Agriculture with dynamic Ushr rate (Req #3)
     7.  Collect Business (with property logic — Req #2)
     8.  Sum total zakatable wealth
     9.  Check Nisab & apply 2.5% + Ushr
     10. Update results panel
     11. Build breakdown list
   ============================================================= */

function calculateZakat() {

  /* ---- Step 1: Read settings ---- */
  var currencyCode = document.getElementById("currency").value;
  var nisabType    = document.getElementById("nisabType").value;
  var cur          = CURRENCIES[currencyCode] || CURRENCIES["USD"];
  var rate         = cur.rate;


  /* ---- Step 2: Determine metal prices in local currency ---- */
  var customRate = getVal("nisabRateInput");

  var goldPriceLocal, silverPriceLocal;
  if (nisabType === "gold") {
    goldPriceLocal   = customRate > 0 ? customRate : DEFAULT_GOLD_PRICE_USD   * rate;
    silverPriceLocal = DEFAULT_SILVER_PRICE_USD * rate;
  } else {
    silverPriceLocal = customRate > 0 ? customRate : DEFAULT_SILVER_PRICE_USD * rate;
    goldPriceLocal   = DEFAULT_GOLD_PRICE_USD * rate;
  }


  /* ---- Step 3: Nisab threshold in local currency ---- */
  var nisabThreshold = (nisabType === "gold")
    ? GOLD_NISAB_GRAMS   * goldPriceLocal
    : SILVER_NISAB_GRAMS * silverPriceLocal;


  /* ---- Step 4: Cash & Bank ---- */
  var cashHomeVal       = getVal("cashHome");
  var bankBalanceVal    = getVal("bankBalance");
  var savingsAccountVal = getVal("savingsAccount");


  /* ---- Step 5: Gold & Silver ----
     Auto-fill may have already computed goldValue / silverValue.
     Fall back to grams × default price if value field is 0. */
  var goldGramsVal  = getVal("goldGrams");
  var goldValueVal  = getVal("goldValue");
  var goldTotal     = goldValueVal > 0 ? goldValueVal : goldGramsVal * goldPriceLocal;

  var silverGramsVal = getVal("silverGrams");
  var silverValueVal = getVal("silverValue");
  var silverTotal    = silverValueVal > 0 ? silverValueVal : silverGramsVal * silverPriceLocal;


  /* ---- Step 6 (Req #3): Agriculture — dynamic Ushr rate ----
     Rate: Natural=10%, Artificial=5%, Mixed=7.5%
     Ushr is due at harvest; no Hawl required. */
  var cropsVal      = getVal("cropsValue");
  var ushrRate      = getUshrRate();             /* 0.10 / 0.05 / 0.075 */
  var totalUshr     = cropsVal * ushrRate;
  var totalAgriValue = cropsVal;


  /* ---- Step 7 (Req #2): Business & Property ---- */
  var businessCashVal      = getVal("businessCash");
  var businessInventoryVal = getVal("businessInventory");
  var businessShareVal     = getVal("businessShare");

  /* Property: use intent-aware helper */
  var propertyData     = getPropertyZakatValue();
  var propertyZakatVal = propertyData.zakatableValue;


  /* ---- Step 8: Total zakatable wealth ---- */
  var totalAssets =
    cashHomeVal + bankBalanceVal + savingsAccountVal +        /* Cash & Bank      */
    goldTotal   + silverTotal   +                            /* Metals           */
    totalAgriValue +                                         /* Agriculture      */
    businessCashVal + businessInventoryVal +
    propertyZakatVal + businessShareVal;                     /* Business/Property */

  var netWealth = totalAssets; /* no liabilities section */


  /* ---- Step 9: Nisab check & Zakat calculation ---- */
  var nisabReached  = netWealth >= nisabThreshold;
  var zakatStandard = nisabReached ? netWealth * 0.025 : 0;
  var totalZakatDue = zakatStandard + totalUshr; /* Ushr added regardless of Nisab */


  /* ---- Step 10: Update results panel ---- */
  document.getElementById("resultsPlaceholder").style.display = "none";
  document.getElementById("resultsContent").style.display     = "block";

  /* Nisab status */
  var statusBox = document.getElementById("nisabStatusBox");
  var badge     = document.getElementById("nisabBadge");
  var desc      = document.getElementById("nisabDescription");

  if (nisabReached) {
    statusBox.classList.remove("not-reached");
    badge.classList.remove("not-reached");
    badge.textContent = "✓ Nisab Reached";
    desc.textContent  = "Your total assets exceed the Nisab threshold. Zakat is obligatory upon you.";
  } else {
    statusBox.classList.add("not-reached");
    badge.classList.add("not-reached");
    badge.textContent = "✗ Nisab Not Reached";
    desc.textContent  = "Your net wealth is below the Nisab threshold. Standard Zakat is not obligatory — but agricultural Ushr still applies if you have crops.";
  }

  /* Summary figures */
  document.getElementById("totalAssetsDisplay").textContent    = formatMoney(totalAssets,    currencyCode);
  document.getElementById("netWealthDisplay").textContent      = formatMoney(netWealth,       currencyCode);
  document.getElementById("nisabThresholdDisplay").textContent = formatMoney(nisabThreshold, currencyCode);

  /* Zakat due */
  document.getElementById("zakatDueDisplay").textContent  = formatMoney(totalZakatDue, currencyCode);
  document.getElementById("zakatDueCurrency").textContent = cur.name;


  /* ---- Step 11: Asset breakdown list ---- */
  var ushrRatePct = Math.round(ushrRate * 1000) / 10; /* e.g. 7.5 */

  var breakdownItems = [
    { name: "💵 Cash at Home",               value: cashHomeVal           },
    { name: "🏦 Bank Balance",               value: bankBalanceVal        },
    { name: "💰 Savings Account",            value: savingsAccountVal     },
    { name: "🥇 Gold",                       value: goldTotal             },
    { name: "🥈 Silver",                     value: silverTotal           },
    { name: "🌾 Crops Value",                value: cropsVal              },
    { name: "🏢 Business Cash",              value: businessCashVal       },
    { name: "📦 Trade Inventory",            value: businessInventoryVal  },
    { name: propertyData.label,              value: propertyZakatVal      },
    { name: "🤝 Business Partnership Share", value: businessShareVal      }
  ];

  var listEl = document.getElementById("breakdownList");
  listEl.innerHTML = "";
  var hasItems = false;

  breakdownItems.forEach(function (item) {
    if (item.value > 0) {
      hasItems = true;
      var div  = document.createElement("div");
      div.className = "breakdown-item";
      div.innerHTML =
        '<span class="breakdown-item-name">'   + item.name  + '</span>' +
        '<span class="breakdown-item-amount">' + formatMoney(item.value, currencyCode) + '</span>';
      listEl.appendChild(div);
    }
  });

  /* Agricultural Ushr line (highlighted separately) */
  if (totalUshr > 0) {
    var ushrDiv = document.createElement("div");
    ushrDiv.className = "breakdown-item";
    ushrDiv.style.borderTop  = "1px dashed #b8ddd6";
    ushrDiv.style.marginTop  = "6px";
    ushrDiv.style.paddingTop = "8px";
    ushrDiv.innerHTML =
      '<span class="breakdown-item-name" style="color:#005041;font-weight:600;">🌾 Agricultural Zakat (Ushr ' + ushrRatePct + '%)</span>' +
      '<span class="breakdown-item-amount" style="color:#005041;">' + formatMoney(totalUshr, currencyCode) + '</span>';
    listEl.appendChild(ushrDiv);
  }

  if (!hasItems) {
    listEl.innerHTML = '<p style="font-size:13px;color:#888;text-align:center;padding:8px 0;">No assets entered yet.</p>';
  }

  /* Scroll to results on mobile */
  if (window.innerWidth <= 1024) {
    var resultsPanel = document.getElementById("resultsPanel");
    if (resultsPanel) {
      setTimeout(function () {
        resultsPanel.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }
}


/* =============================================================
   SECTION 18: RESET CALCULATOR
   ============================================================= */

function resetCalculator() {
  var inputs = document.querySelectorAll(".form-input");
  inputs.forEach(function (input) {
    input.value = "";
    input.classList.remove("input-error");
  });

  /* Reset irrigation dropdown back to natural */
  var irrigationType = document.getElementById("irrigationType");
  if (irrigationType) {
    irrigationType.value = "natural";
    updateUshrRate();
  }

  /* Reset property intent to resale */
  var propertyIntent = document.getElementById("propertyIntent");
  if (propertyIntent) propertyIntent.value = "resale";

  hideResults();
  clearAllNisabIndicators();
  showToast("Calculator has been reset.");
}


/* =============================================================
   SECTION 19: SHARE RESULT
   ============================================================= */

function initShare() {
  var btn = document.getElementById("shareBtn");
  if (!btn) return;

  btn.addEventListener("click", function () {
    var zakatText = document.getElementById("zakatDueDisplay").textContent;
    var currency  = document.getElementById("zakatDueCurrency").textContent;
    var shareText = "I just calculated my Zakat: " + zakatText + " (" + currency + "). Calculate yours at LuminaDeen Zakat";

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareText).then(function () {
        showToast("Result copied to clipboard!");
      }).catch(function () {
        showToast("Could not copy. Please screenshot your results.");
      });
    } else {
      showToast("Share: " + shareText);
    }
  });
}


/* =============================================================
   SECTION 20: LIVE PREVIEW (real-time recalculation)
   Recalculates whenever a field changes, if results are already shown.
   Also triggers Nisab indicator updates.
   ============================================================= */

function liveRecalcIfOpen() {
  var resultsContent = document.getElementById("resultsContent");
  if (resultsContent && resultsContent.style.display !== "none") {
    calculateZakat();
  }
}

function initLivePreview() {
  /* Monitor all form inputs & selects */
  var inputs = document.querySelectorAll(".form-input, .form-select");
  inputs.forEach(function (input) {
    input.addEventListener("input", function () {
      liveRecalcIfOpen();
    });
    input.addEventListener("change", function () {
      liveRecalcIfOpen();
    });
  });

  /* Nisab indicators — update on any cash/gold/agri input change */
  var cashIds = ["cashHome", "bankBalance", "savingsAccount"];
  cashIds.forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener("input", updateCashNisabIndicator);
  });

  var goldIds = ["goldGrams", "goldPricePerGram", "goldValue", "silverGrams", "silverPricePerGram", "silverValue"];
  goldIds.forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener("input", updateGoldNisabIndicator);
  });

  var agriIds = ["cropQuantityKg", "cropPricePerKg", "cropsValue"];
  agriIds.forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener("input", function() { updateAgriNisabIndicator(); });
  });

  var propEl = document.getElementById("propertyValue");
  if (propEl) propEl.addEventListener("input", updatePropertyNisabIndicator);

  var intentEl = document.getElementById("propertyIntent");
  if (intentEl) intentEl.addEventListener("change", updatePropertyNisabIndicator);
}


/* =============================================================
   SECTION 21: SCROLL SPY
   ============================================================= */

function initScrollSpy() {
  var sections = ["calculator", "how-it-works", "faq"];
  var links    = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", function () {
    var scrollPos = window.scrollY + 100;

    sections.forEach(function (id) {
      var section = document.getElementById(id);
      if (!section) return;

      var top    = section.offsetTop;
      var bottom = top + section.offsetHeight;

      if (scrollPos >= top && scrollPos < bottom) {
        links.forEach(function (link) { link.style.color = ""; }); /* reset */
        links.forEach(function (link) {
          if (link.getAttribute("href") === "#" + id) {
            link.style.color = "#005041";
          }
        });
      }
    });
  });
}


/* =============================================================
   SECTION 22: SCROLL ANIMATIONS
   ============================================================= */

function initScrollAnimations() {
  var cards = document.querySelectorAll(".step-card, .nisab-info-card, .faq-item");

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(function (card) {
    card.style.opacity    = "0";
    card.style.transform  = "translateY(20px)";
    card.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    observer.observe(card);
  });
}


/* =============================================================
   SECTION 23: INITIALISATION
   Runs when the DOM is fully loaded.
   ============================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* Core UI components */
  initAccordions();
  initFAQ();
  initHamburger();
  initNavCTA();
  initShare();
  initLivePreview();
  initScrollSpy();
  initScrollAnimations();

  /* Req #1: Comma formatting on all amount/weight inputs */
  initCommaFormatting();

  /* Calculate button */
  var calcBtn = document.getElementById("calculateBtn");
  if (calcBtn) {
    calcBtn.addEventListener("click", calculateZakat);
  }

  /* Reset button */
  var resetBtn = document.getElementById("resetBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", resetCalculator);
  }

  /* Currency dropdown — reset fields + update prefixes + update nisab hint */
  var currencySelect = document.getElementById("currency");
  if (currencySelect) {
    currencySelect.addEventListener("change", function () {
      resetAllFields();
      updateCurrencyPrefixes();
      updateNisabRateField();
    });
  }

  /* Nisab type dropdown — reset fields + update rate label */
  var nisabSelect = document.getElementById("nisabType");
  if (nisabSelect) {
    nisabSelect.addEventListener("change", function () {
      resetAllFields();
      updateNisabRateField();
    });
  }

  /* Gold karat dropdown — update label + re-calc auto-value */
  var karatSelect = document.getElementById("goldKarat");
  if (karatSelect) {
    karatSelect.addEventListener("change", function () {
      updateGoldKaratLabel();
      autoCalcGoldValue();
    });
  }

  /* Irrigation type — update Ushr rate badge */
  var irrigationSelect = document.getElementById("irrigationType");
  if (irrigationSelect) {
    irrigationSelect.addEventListener("change", updateUshrRate);
  }

  /* Property intent — update Nisab indicator */
  var intentSelect = document.getElementById("propertyIntent");
  if (intentSelect) {
    intentSelect.addEventListener("change", updatePropertyNisabIndicator);
  }

  /* Page-load defaults: apply currency symbols, nisab label, karat label */
  updateCurrencyPrefixes();
  updateNisabRateField();
  updateGoldKaratLabel();
  updateUshrRate(); /* initialise Ushr badge with natural 10% */

});
