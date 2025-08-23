document.getElementById("regime-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const weight = parseFloat(document.getElementById("weight").value);
  const age = parseInt(document.getElementById("age").value);
  const regime = document.getElementById("regime").value.toLowerCase();
  const output = document.getElementById("output");

  // ✅ DSTB
  if (regime === "dstb") {
    if (age < 18) {
      let result = getPediatricDosage(weight);
      output.innerHTML = `
        <h3>Paediatric DSTB Dosage</h3>
        <p><b>Age:</b> ${age} years | <b>Weight:</b> ${weight} kg</p>
        <div class="table-wrapper">
          <table class="responsive-table">
            <thead>
              <tr><th>Duration</th><th>Drug</th><th>Number of Tablets</th></tr>
            </thead>
            <tbody>
              <tr>
                <td rowspan="3">2 Months - Intensive Phase</td>
                <td>HRZ (H-50 mg/R-75 mg/Z-150 mg)</td>
                <td>${result.intensive.HRZ}</td>
              </tr>
              <tr><td>E (E-100 mg)</td><td>${result.intensive.E}</td></tr>
              <tr><td>Adult FDC (H-75 mg/R-150 mg/Z-400 mg/E-275 mg)</td><td>${result.intensive.adult}</td></tr>
              <tr>
                <td rowspan="3">4 Months - Continuation Phase</td>
                <td>HR (H-50 mg/R-75 mg)</td>
                <td>${result.continuation.HR}</td>
              </tr>
              <tr><td>E (E-100 mg)</td><td>${result.continuation.E}</td></tr>
              <tr><td>Adult FDC (H-75 mg/R-150 mg/E-275 mg)</td><td>${result.continuation.adult}</td></tr>
            </tbody>
          </table>
        </div>
      `;
    } else {
      let result = getAdultDosage(weight);
      output.innerHTML = `
        <h3>Adult DSTB Dosage</h3>
        <p><b>Age:</b> ${age} years | <b>Weight:</b> ${weight} kg</p>
        <div class="table-wrapper">
          <table class="responsive-table">
            <thead>
              <tr><th>Duration</th><th>Drug</th><th>Number of Tablets</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>2 Months - Intensive Phase</td>
                <td>HRZE (Adult-H-75 mg/R-150 mg/Z-400 mg/E-275 mg)</td>
                <td>${result.intensive}</td>
              </tr>
              <tr>
                <td>4 Months - Continuation Phase</td>
                <td>HRE (Adult-H-75 mg/R-150 mg/E-275 mg)</td>
                <td>${result.continuation}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    }
  }

  // ✅ H mono/poly DR-TB regimen
  else if (regime === "h mono/poly dr-tb regimen") {
    const replacementAllowed = document.getElementById("replacement-allowed").value;
    const replacementChoice = document.getElementById("replacement-choice").value;

    if (replacementAllowed === "yes") {
      output.innerHTML = wrapTable(getHMonoPolyYes(weight));
    } else if (replacementAllowed === "no") {
      if (replacementChoice) {
        output.innerHTML = wrapTable(getReplacement(weight, replacementChoice));
      } else {
        output.innerHTML = `<p>Please select a replacement option.</p>`;
      }
    } else {
      output.innerHTML = `<p>Please answer Replacement Sequence question.</p>`;
    }
  }

  // ✅ BPaLM Regimen
  else if (regime === "bpalm regimen-26 /39weeks") {
    if (age < 14) {
      output.innerHTML = `<p>⚠️ BPaLM regimen is only applicable for patients aged 14 years and above.</p>`;
    } else {
      output.innerHTML = wrapTable(getBPaLMDosage(weight, age));
    }
  }

  // ✅ Fallback
  else {
    output.textContent = `✅ Your Weight: ${weight} kg | Regime: ${regime}`;
  }
});

/* ---------- DSTB HELPERS ---------- */
function getPediatricDosage(weight) {
  if (weight >= 4 && weight <= 7) return { intensive: { HRZ: "1", E: "1", adult: "0" }, continuation: { HR: "1", E: "1", adult: "0" } };
  if (weight >= 8 && weight <= 11) return { intensive: { HRZ: "2", E: "2", adult: "0" }, continuation: { HR: "2", E: "2", adult: "0" } };
  if (weight >= 12 && weight <= 15) return { intensive: { HRZ: "3", E: "3", adult: "0" }, continuation: { HR: "3", E: "3", adult: "0" } };
  if (weight >= 16 && weight <= 24) return { intensive: { HRZ: "4", E: "4", adult: "0" }, continuation: { HR: "4", E: "4", adult: "0" } };
  if (weight >= 25 && weight <= 29) return { intensive: { HRZ: "3", E: "3", adult: "1" }, continuation: { HR: "3", E: "3", adult: "1" } };
  if (weight >= 30 && weight <= 39) return { intensive: { HRZ: "2", E: "2", adult: "2" }, continuation: { HR: "2", E: "2", adult: "2" } };
  return { intensive: { HRZ: "-", E: "-", adult: "-" }, continuation: { HR: "-", E: "-", adult: "-" } };
}

function getAdultDosage(weight) {
  if (weight >= 25 && weight <= 34) return { intensive: "2", continuation: "2" };
  if (weight >= 35 && weight <= 49) return { intensive: "3", continuation: "3" };
  if (weight >= 50 && weight <= 64) return { intensive: "4", continuation: "4" };
  if (weight >= 65 && weight <= 75) return { intensive: "5", continuation: "5" };
  if (weight > 75) return { intensive: "6", continuation: "6" };
  return { intensive: "-", continuation: "-" };
}

/* ---------- H MONO/POLY HELPERS ---------- */
function getWeightBand(weight) {
  if (weight >= 26 && weight <= 29) return "26-29";
  if (weight >= 30 && weight <= 45) return "30-45";
  if (weight >= 46 && weight <= 70) return "46-70";
  if (weight > 70) return ">70";
  return null;
}

function getHMonoPolyYes(weight) {
  let band = getWeightBand(weight);
  if (!band) return `<p>⚠️ Weight below 26 kg not supported for this regimen.</p>`;

  const table = {
    "26-29": { R: "300 mg", E: "400 mg", Z: "750 mg", Lfx: "250 mg" },
    "30-45": { R: "450 mg", E: "800 mg", Z: "1250 mg", Lfx: "750 mg" },
    "46-70": { R: "600 mg", E: "1200 mg", Z: "1750 mg", Lfx: "1000 mg" },
    ">70": { R: "750 mg", E: "1600 mg", Z: "2000 mg", Lfx: "1000 mg" }
  };

  let d = table[band];
  return `
    <h3>H mono/poly DR-TB regimen (Allowed)</h3>
    <p><b>Weight:</b> ${weight} kg (${band} kg)</p>
    <table class="responsive-table">
      <thead><tr><th>Drug</th><th>Dosage</th></tr></thead>
      <tbody>
        <tr><td>Rifampicin (R)</td><td>${d.R}</td></tr>
        <tr><td>Ethambutol (E)</td><td>${d.E}</td></tr>
        <tr><td>Pyrazinamide (Z)</td><td>${d.Z}</td></tr>
        <tr><td>Levofloxacin (Lfx)</td><td>${d.Lfx}</td></tr>
      </tbody>
    </table>
  `;
}

function getReplacement(weight, option) {
  let band = getWeightBand(weight);
  if (!band) return `<p>⚠️ Weight below 26 kg not supported for this regimen.</p>`;

  const base = {
    "26-29": { R: "300 mg", E: "400 mg", Z: "750 mg", Lfx: "250 mg", Lzd: "300 mg", Cfz: "50 mg", Cs: "250 mg" },
    "30-45": { R: "450 mg", E: "800 mg", Z: "1250 mg", Lfx: "750 mg", Lzd: "600 mg", Cfz: "100 mg", Cs: "500 mg" },
    "46-70": { R: "600 mg", E: "1200 mg", Z: "1750 mg", Lfx: "1000 mg", Lzd: "600 mg", Cfz: "100 mg", Cs: "750 mg" },
    ">70": { R: "750 mg", E: "1600 mg", Z: "2000 mg", Lfx: "1000 mg", Lzd: "600 mg", Cfz: "200 mg", Cs: "1000 mg" }
  };

  let d = base[band];
  let drugs = [];

  if (option === "lfx+z(1)") {
    drugs = ["R", "E", "Lzd", "Cfz"]; // Option 1
  } else if (option === "lfx+z(2)") {
    drugs = ["R", "E", "Cfz", "Cs"]; // Option 2
  } else if (option === "lfx+z(3)") {
    drugs = ["R", "E", "Lzd", "Cs"]; // Option 3
  } else if (option === "lfx") {
    drugs = ["R", "E", "Z", "Lzd"];
  } else if (option === "z") {
    drugs = ["R", "E", "Lfx", "Lzd"];
  } else if (option === "lzd") {
    drugs = ["R", "E", "Lfx", "Cfz", "Cs"];
  } else {
    return `<p>⚠️ Option not yet implemented</p>`;
  }

  let rows = drugs.map(drug => {
    let name = {
      R: "Rifampicin (R)", E: "Ethambutol (E)", Z: "Pyrazinamide (Z)",
      Lfx: "Levofloxacin (Lfx)", Lzd: "Linezolid (Lzd)",
      Cfz: "Clofazimine (Cfz)", Cs: "Cycloserine (Cs)"
    }[drug];
    return `<tr><td>${name}</td><td>${d[drug]}</td></tr>`;
  }).join("");

  return `
    <h3>Replacement Regimen: ${option.toUpperCase()}</h3>
    <p><b>Weight:</b> ${weight} kg (${band} kg)</p>
    <table class="responsive-table">
      <thead><tr><th>Drug</th><th>Dosage</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

/* ---------- BPaLM HELPERS ---------- */
function getBPaLMDosage(weight, age) {
  let pdx;
  if (weight >= 16 && weight <= 29) {
    pdx = { dose: "50 mg once daily", tablet: "1 × Pdx 50 mg tablet" };
  } else if (weight >= 30) {
    pdx = { dose: "100 mg once daily", tablet: "1 × Pdx 100 mg tablet" };
  } else {
    pdx = { dose: "-", tablet: "-" };
  }

  return `
    <h3>BPaLM regimen (26/39 weeks)</h3>
    <p><b>Age:</b> ${age} years | <b>Weight:</b> ${weight} kg</p>
    <table class="responsive-table">
      <thead><tr><th>Drug</th><th>Duration</th><th>Dosage</th><th>No. of Tablets</th></tr></thead>
      <tbody>
        <tr><td>Bedaquiline (Bdq)</td><td>First Two Weeks</td><td>400 mg once daily</td><td>(4 × Bdq 100 mg)</td></tr>
        <tr><td>Bedaquiline (Bdq)</td><td>Weeks 3rd–26/39*</td><td>200 mg three times a week</td><td>(2 × Bdq 100 mg)</td></tr>
        <tr><td>Pretomanid (Pa)</td><td>Weeks 1–26/39*</td><td>200 mg once daily</td><td>(1 × Pa 200 mg)</td></tr>
        <tr><td>Linezolid (Lzd)</td><td>Weeks 1–26/39*</td><td>600 mg once daily</td><td>(1 × Lzd 600 mg)</td></tr>
        <tr><td>Moxifloxacin (Mfx)</td><td>Weeks 1–26/39*</td><td>400 mg once daily</td><td>(1 × Mfx 400 mg)</td></tr>
        <tr><td>Pyridoxine (Pdx)</td><td>Weeks 1–26/39*</td><td>${pdx.dose}</td><td>${pdx.tablet}</td></tr>
      </tbody>
    </table>
  `;
}

/* ---------- WRAPPER FUNCTION ---------- */
function wrapTable(html) {
  return `<div class="table-wrapper">${html}</div>`;
}

/* ---------- DOM HANDLERS ---------- */
const regimeSelect = document.getElementById("regime");
const replacementQuestion = document.getElementById("replacement-question");
const replacementAllowed = document.getElementById("replacement-allowed");
const replacementOptions = document.getElementById("replacement-options");

regimeSelect.addEventListener("change", () => {
  if (regimeSelect.value === "H mono/poly DR-TB regimen") {
    replacementQuestion.style.display = "block";
  } else {
    replacementQuestion.style.display = "none";
    replacementOptions.style.display = "none";
  }
});

replacementAllowed.addEventListener("change", () => {
  if (replacementAllowed.value === "no") {
    replacementOptions.style.display = "block";
  } else {
    replacementOptions.style.display = "none";
  }
});
