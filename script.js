document.getElementById("regime-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const weight = parseFloat(document.getElementById("weight").value);
  const age = parseInt(document.getElementById("age").value);
  const regime = document.getElementById("regime").value.toLowerCase();
  const output = document.getElementById("output");

  let downloadBtn = document.getElementById("downloadBtn");

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
                <td rowspan="3">2 Months - Intensive Phase (2 HRZE)</td>
                <td>HRZ (H-50 mg/R-75 mg/Z-150 mg)</td>
                <td>${result.intensive.HRZ}</td>
              </tr>
              <tr><td>E (E-100 mg)</td><td>${result.intensive.E}</td></tr>
              <tr><td>Adult FDC (H-75 mg/R-150 mg/Z-400 mg/E-275 mg)</td><td>${result.intensive.adult}</td></tr>
              <tr>
                <td rowspan="3">4 Months - Continuation Phase (4 HRE) </td>
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
                <td>2 Months - Intensive Phase (2 HRZE)</td>
                <td>HRZE (Adult-H-75 mg/R-150 mg/Z-400 mg/E-275 mg)</td>
                <td>${result.intensive}</td>
              </tr>
              <tr>
                <td>4 Months - Continuation Phase (4 HRE)</td>
                <td>HRE (Adult-H-75 mg/R-150 mg/E-275 mg)</td>
                <td>${result.continuation}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    }
    downloadBtn.style.display = "inline-block";
  }


  // ✅ H mono/poly DR-TB regimen
  else if (regime === "h mono/poly dr-tb regimen") {
    const replacementAllowed = document.getElementById("replacement-allowed").value;
    const replacementChoice = document.getElementById("replacement-choice").value;

    if (replacementAllowed === "yes") {
      output.innerHTML = wrapTable(getHMonoPolyYes(weight));
      downloadBtn.style.display = "inline-block";
    } else if (replacementAllowed === "no") {
      if (replacementChoice) {
        output.innerHTML = wrapTable(getReplacement(weight, replacementChoice));
        downloadBtn.style.display = "inline-block";
      } else {
        output.innerHTML = `<p>Please select a replacement option.</p>`;
        downloadBtn.style.display = "none";
      }
    } else {
      output.innerHTML = `<p>Please answer Replacement Sequence question.</p>`;
      downloadBtn.style.display = "none";
    }
  }

  // ✅ BPaLM Regimen
  else if (regime === "bpalm regimen-26 /39weeks") {
    if (age < 14) {
      output.innerHTML = `<p>⚠️ BPaLM regimen is only applicable for patients aged 14 years and above.</p>`;
      downloadBtn.style.display = "none";
    } else {
      output.innerHTML = wrapTable(getBPaLMDosage(weight, age));
      downloadBtn.style.display = "inline-block";
    }
  }

  // ✅ MDRTB Regimen
  else if (regime === "mdrtb") {
    const mdrChoice = document.getElementById("mdr-choice").value;

    if (age < 14) {
      output.innerHTML = `<p>⚠️ MDR/RR-TB regimen is not allowed for patients below 14 years.</p>`;
      downloadBtn.style.display = "none";
      return;
    }

    if (!mdrChoice) {
      output.innerHTML = `<p>Please select a medicine option (Linezolid or Ethionamide).</p>`;
      downloadBtn.style.display = "none";
      return;
    }

    if (mdrChoice === "linezolid") {
      output.innerHTML = wrapTable(getMDRLinezolid(weight));
    } else if (mdrChoice === "ethionamide") {
      output.innerHTML = wrapTable(getMDREthionamide(weight));
    }
    downloadBtn.style.display = "inline-block";
  }
  // ✅ 18-20 months longer oral M/XDR-TB regimen
  else if (regime === "longermdrtb") {
    if (age < 14) {
      output.innerHTML = `<p>⚠️ This regimen is not allowed for patients below 14 years.</p>`;
      downloadBtn.style.display = "none";
    } else {
      output.innerHTML = wrapTable(getLongerMDRTB(weight));
      downloadBtn.style.display = "inline-block";
    }
  }

  else if (regime === "longerreplacement") {
    if (age < 14) {
      output.innerHTML = `<p>⚠️ This regimen is not allowed for patients below 14 years.</p>`;
      downloadBtn.style.display = "none";
    } else {
      output.innerHTML = wrapTable(getLongerMDRTBReplacement(weight));
      downloadBtn.style.display = "inline-block";
    }
  }


  // ✅ Fallback
  else {
    output.textContent = `✅ Your Weight: ${weight} kg | Regime: ${regime}`;
    downloadBtn.style.display = "none";
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
    <h3>H mono/poly DR-TB regimen (6 or 9 months) Lfx R Z E </h3>
    <p><b>Weight:</b> ${weight} kg (${band} kg)</p>
    <table class="responsive-table">
      <thead><tr><th>Drug</th><th>Dosage</th></tr></thead>
      <tbody>
       <tr><td>Levofloxacin (Lfx)</td><td>${d.Lfx}</td></tr>
        <tr><td>Rifampicin (R)</td><td>${d.R}</td></tr>
        <tr><td>Pyrazinamide (Z)</td><td>${d.Z}</td></tr>
        <tr><td>Ethambutol (E)</td><td>${d.E}</td></tr>
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
  <h3>H mono/poly DR-TB regimen (6 or 9 months)</h3>
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
    <h3>6-9 Months BPaLM regimen (26/39 weeks) </h3>
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
/* ---------- MDRTB HELPERS ---------- */

function getWeightBand(weight) {
  if (weight >= 26 && weight <= 29) return "26-29";
  if (weight >= 30 && weight <= 45) return "30-45";
  if (weight >= 46 && weight <= 70) return "46-70";
  if (weight > 70) return ">70";
  return null;
}

function getMDRLinezolid(weight) {
  const band = getWeightBand(weight);
  if (!band) return `<p>⚠️ Weight below 26 kg not supported for this regimen.</p>`;

  const data = {
    "26-29": { Lzd: "600 mg", Lfx: "250 mg", Cfz: "50 mg", Z: "750 mg", E: "400 mg", Hh: "300 mg", Pdx: "50 mg" },
    "30-45": { Lzd: "600 mg", Lfx: "750 mg", Cfz: "100 mg", Z: "1250 mg", E: "800 mg", Hh: "600 mg", Pdx: "100 mg" },
    "46-70": { Lzd: "600 mg", Lfx: "1000 mg", Cfz: "100 mg", Z: "1750 mg", E: "1200 mg", Hh: "900 mg", Pdx: "100 mg" },
    ">70": { Lzd: "600 mg", Lfx: "1000 mg", Cfz: "200 mg", Z: "2000 mg", E: "1600 mg", Hh: "900 mg", Pdx: "100 mg" }
  };

  const d = data[band];

  return `
    <h3>9-11 Month Shorter Oral MDR/RR-TB Regimen with Linezolid</h3>
    <p><b>Weight:</b> ${weight} kg (${band} kg)</p>

    <!-- Intensive Phase -->
    <h4>Intensive Phase (2 Lzd + 4-6 Lfx Cfz Z E Hh + 6-9 Bdq)</h4>
    <table class="responsive-table">
      <thead><tr><th>Drug</th><th>Duration</th><th>Dosage</th></tr></thead>
      <tbody>
        <tr><td>Linezolid (Lzd)</td><td>2 Months</td><td>${d.Lzd}</td></tr>
        <tr><td>Levofloxacin (Lfx)</td><td>4-6 Months</td><td>${d.Lfx}</td></tr>
        <tr><td>Clofazimine (Cfz)</td><td>4-6 Months</td><td>${d.Cfz}</td></tr>
        <tr><td>Pyrazinamide (Z)</td><td>4-6 Months</td><td>${d.Z}</td></tr>
        <tr><td>Ethambutol (E)</td><td>4-6 Months</td><td>${d.E}</td></tr>
        <tr><td>High dose H (Hh)</td><td>4-6 Months</td><td>${d.Hh}</td></tr>
        <tr><td>Pyridoxine (Pdx)</td><td>4-6 Months</td><td>${d.Pdx}</td></tr>
        <tr><td>Bedaquiline (Bdq)</td><td>First 2 Weeks</td><td>400 mg once daily</td></tr>
        <tr><td>Bedaquiline (Bdq)</td><td>Weeks 3–24/36</td><td>200 mg three times a week</td></tr>
      </tbody>
    </table>

    <!-- Continuation Phase -->
    <h4>Continuation Phase (5 Lfx Cfz Z E)</h4>
    <table class="responsive-table">
      <thead><tr><th>Drug</th><th>Duration</th><th>Dosage</th></tr></thead>
      <tbody>
        <tr><td>Levofloxacin (Lfx)</td><td>5 Months</td><td>${d.Lfx}</td></tr>
        <tr><td>Clofazimine (Cfz)</td><td>5 Months</td><td>${d.Cfz}</td></tr>
        <tr><td>Pyrazinamide (Z)</td><td>5 Months</td><td>${d.Z}</td></tr>
        <tr><td>Ethambutol (E)</td><td>5 Months</td><td>${d.E}</td></tr>
        <tr><td>Pyridoxine (Pdx)</td><td>5 Months</td><td>${d.Pdx}</td></tr>
      </tbody>
    </table>
  `;
}

function getMDREthionamide(weight) {
  const band = getWeightBand(weight);
  if (!band) return `<p>⚠️ Weight below 26 kg not supported for this regimen.</p>`;

  const data = {
    "26-29": { Lfx: "250 mg", Cfz: "50 mg", Eto: "375 mg", Z: "750 mg", E: "400 mg", Hh: "300 mg", Pdx: "50 mg" },
    "30-45": { Lfx: "750 mg", Cfz: "100 mg", Eto: "500 mg", Z: "1250 mg", E: "800 mg", Hh: "600 mg", Pdx: "100 mg" },
    "46-70": { Lfx: "1000 mg", Cfz: "100 mg", Eto: "750 mg", Z: "1750 mg", E: "1200 mg", Hh: "900 mg", Pdx: "100 mg" },
    ">70": { Lfx: "1000 mg", Cfz: "200 mg", Eto: "1000 mg", Z: "2000 mg", E: "1600 mg", Hh: "900 mg", Pdx: "100 mg" }
  };

  const d = data[band];

  return `
    <h3>9-11 Month Shorter Oral MDR/RR-TB Regimen with Ethionamide</h3>
    <p><b>Weight:</b> ${weight} kg (${band} kg)</p>

    <!-- Intensive Phase -->
    <h4>Intensive Phase (4-6 Lfx Cfz Eto Z E Hh + 6-9 Bdq)</h4>
    <table class="responsive-table">
      <thead><tr><th>Drug</th><th>Duration</th><th>Dosage</th></tr></thead>
      <tbody>
        <tr><td>Levofloxacin (Lfx)</td><td>4-6 Months</td><td>${d.Lfx}</td></tr>
        <tr><td>Clofazimine (Cfz)</td><td>4-6 Months</td><td>${d.Cfz}</td></tr>
        <tr><td>Ethionamide (Eto)<sup style="color:#FFD700;">*</sup></td><td>4-6 Months</td><td>${d.Eto}</td></tr>
        <tr><td>Pyrazinamide (Z)</td><td>4-6 Months</td><td>${d.Z}</td></tr>
        <tr><td>Ethambutol (E)</td><td>4-6 Months</td><td>${d.E}</td></tr>
        <tr><td>High dose H (Hh)</td><td>4-6 Months</td><td>${d.Hh}</td></tr>
        <tr><td>Pyridoxine (Pdx)</td><td>4-6 Months</td><td>${d.Pdx}</td></tr>
        <tr><td>Bedaquiline (Bdq)</td><td>First 2 Weeks</td><td>400 mg once daily</td></tr>
        <tr><td>Bedaquiline (Bdq)</td><td>Weeks 3–24/36</td><td>200 mg three times a week</td></tr>
      </tbody>
    </table>
    <p style="font-size:18px; font-weight:bold; color:#FFD700; margin-top:10px;">
  * Drugs can be given in divided doses in a day in the event of intolerance
</p>


    <!-- Continuation Phase -->
    <h4>Continuation Phase (5 Lfx Cfz Z E)</h4>
    <table class="responsive-table">
      <thead><tr><th>Drug</th><th>Duration</th><th>Dosage</th></tr></thead>
      <tbody>
        <tr><td>Levofloxacin (Lfx)</td><td>5 Months</td><td>${d.Lfx}</td></tr>
        <tr><td>Clofazimine (Cfz)</td><td>5 Months</td><td>${d.Cfz}</td></tr>
        <tr><td>Pyrazinamide (Z)</td><td>5 Months</td><td>${d.Z}</td></tr>
        <tr><td>Ethambutol (E)</td><td>5 Months</td><td>${d.E}</td></tr>
        <tr><td>Pyridoxine (Pdx)</td><td>5 Months</td><td>${d.Pdx}</td></tr>
      </tbody>
    </table>
  `;
}
/* ----------Longer MDRTB HELPERS ---------- */
function getLongerMDRTB(weight) {
  const band = getWeightBand(weight);
  if (!band) return `<p>⚠️ Weight below 26 kg not supported for this regimen.</p>`;

  const data = {
    "26-29": { Bdq1: "400 mg once daily", Bdq2: "200 mg three times a week", Lfx: "250 mg", Lzd: "600 mg", Cfz: "50 mg", Cs: "250 mg", Pdx: "250 mg" },
    "30-45": { Bdq1: "400 mg once daily", Bdq2: "200 mg three times a week", Lfx: "750 mg", Lzd: "600 mg", Cfz: "100 mg", Cs: "500 mg", Pdx: "500 mg" },
    "46-70": { Bdq1: "400 mg once daily", Bdq2: "200 mg three times a week", Lfx: "1000 mg", Lzd: "600 mg", Cfz: "100 mg", Cs: "750 mg", Pdx: "750 mg" },
    ">70": { Bdq1: "400 mg once daily", Bdq2: "200 mg three times a week", Lfx: "1000 mg", Lzd: "600 mg", Cfz: "200 mg", Cs: "1000 mg", Pdx: "1000 mg" }
  };

  const d = data[band];

  return `
    <h3>18-20 Months Longer Oral M/XDR-TB Regimen (6 or longer) Bdq (18-20 months) Lfx Lzd Cfz Cs</h3>
    <p><b>Weight:</b> ${weight} kg (${band} kg)</p>

    <table class="responsive-table">
      <thead><tr><th>Drug</th><th>Duration</th><th>Dosage</th></tr></thead>
      <tbody>
        <tr><td>Bedaquiline (Bdq)</td><td>First Two Weeks</td><td>${d.Bdq1}</td></tr>
        <tr><td>Bedaquiline (Bdq)</td><td>Weeks 3 to 24–longer</td><td>${d.Bdq2}</td></tr>
        <tr><td>Levofloxacin (Lfx)</td><td>18–20 Months</td><td>${d.Lfx}</td></tr>
        <tr><td>Linezolid (Lzd)</td><td>18–20 Months</td><td>${d.Lzd}</td></tr>
        <tr><td>Clofazimine (Cfz)</td><td>18–20 Months</td><td>${d.Cfz}</td></tr>
        <tr><td>Cycloserine (Cs)<sup style="color:#FFD700;">*</sup></td><td>18–20 Months</td><td>${d.Cs}</td></tr>
        <tr><td>Pyridoxine (Pdx)</td><td>18–20 Months</td><td>${d.Pdx}</td></tr>
      </tbody>
    </table>
    <p style="font-size:18px; font-weight:bold; color:#FFD700; margin-top:10px;">
  * Drugs can be given in divided doses in a day in the event of intolerance
</p>
  `;
}
/* ----------Longer MDRTB HELPERS ---------- */
// with replacements
function getLongerMDRTBReplacement(weight) {
  // Determine weight band
  let band = "";
  if (weight >= 16 && weight <= 29) band = "16-29";
  else if (weight >= 30 && weight <= 45) band = "30-45";
  else if (weight >= 46 && weight <= 70) band = "46-70";
  else if (weight > 70) band = ">70";
  else return `<p>⚠️ Regimen not recommended for weight below 16 kg.</p>`;

  // Dose data
  const dose = {
    "16-29": {
      Lfx: "250 mg", Mfx: "200 mg", Bdq1: "400 mg daily (Weeks 0–2)",
      Bdq2: "200 mg three times per week (Weeks 3–24)",
      Cfz: "50 mg", Cs: "250 mg", Lzd: "300 mg", Dlm: "50 mg twice daily (100 mg) for 24 weeks in 6-11 years of age & 100 mg twice daily (200 mg) for 24 weeks in 12 years and above of age",
      Am: "500 mg", Z: "750 mg", Eto: "375 mg", PAS: "10 gm",
      E: "400 mg", ImpCln: "2 vials (1 g + 1 g) bd (to be used with Clavulanic acid)",
      Mpm: "1000 mg three times daily (alternative dosing is 2000 mg twice  daily) (to be used with Clavulanic acid)", AmxClv: "875/125 mg bd", Pdx: "50 mg"
    },
    "30-45": {
      Lfx: "750 mg", Mfx: "400 mg", Bdq1: "400 mg daily (Weeks 0–2)",
      Bdq2: "200 mg three times per week (Weeks 3–24)",
      Cfz: "100 mg", Cs: "500 mg", Lzd: "600 mg", Dlm: "50 mg twice daily (100 mg) for 24 weeks in 6-11 years of age & 100 mg twice daily (200 mg) for 24 weeks in 12 years and above of age",
      Am: "750 mg", Z: "1250 mg", Eto: "500 mg", PAS: "14 gm",
      E: "800 mg", ImpCln: "2 vials (1 g + 1 g) bd (to be used with Clavulanic acid)",
      Mpm: "1000 mg three times daily (alternative dosing is 2000 mg twice  daily) (to be used with Clavulanic acid)", AmxClv: "875/125 mg bd", Pdx: "100 mg"
    },
    "46-70": {
      Lfx: "1000 mg", Mfx: "400 mg", Bdq1: "400 mg daily (Weeks 0–2)",
      Bdq2: "200 mg three times per week (Weeks 3–24)",
      Cfz: "100 mg", Cs: "750 mg", Lzd: "600 mg", Dlm: "50 mg twice daily (100 mg) for 24 weeks in 6-11 years of age & 100 mg twice daily (200 mg) for 24 weeks in 12 years and above of age",
      Am: "750 mg", Z: "1750 mg", Eto: "750 mg", PAS: "16 gm",
      E: "1200 mg", ImpCln: "2 vials (1 g + 1 g) bd (to be used with Clavulanic acid)",
      Mpm: "1000 mg three times daily (alternative dosing is 2000 mg twice  daily) (to be used with Clavulanic acid)", AmxClv: "875/125 mg bd", Pdx: "100 mg"
    },
    ">70": {
      Lfx: "1000 mg", Mfx: "400 mg", Bdq1: "400 mg daily (Weeks 0–2)",
      Bdq2: "200 mg three times per week (Weeks 3–24)",
      Cfz: "200 mg", Cs: "1000 mg", Lzd: "600 mg", Dlm: "50 mg twice daily (100 mg) for 24 weeks in 6-11 years of age & 100 mg twice daily (200 mg) for 24 weeks in 12 years and above of age",
      Am: "1000 mg", Z: "2000 mg", Eto: "1000 mg", PAS: "22 gm",
      E: "1600 mg", ImpCln: "2 vials (1 g + 1 g) bd (to be used with Clavulanic acid)",
      Mpm: "1000 mg three times daily (alternative dosing is 2000 mg twice  daily) (to be used with Clavulanic acid)", AmxClv: "875/125 mg bd", Pdx: "100 mg"
    }
  };

  const d = dose[band];

  // Return table + notes
  return `
    <h3>Dosage of M/XDR-TB Drugs for Adults</h3>
    <h4>Longer Oral M/XDR-TB Regimen (with Replacement Drugs)</h4>
    <p><b>Weight:</b> ${weight} kg (${band} kg)</p>

    <table class="responsive-table">
      <thead>
        <tr><th>Drug</th><th>Dosage</th></tr>
      </thead>
      <tbody>
        <tr><td>Levofloxacin (Lfx)</td><td>${d.Lfx}</td></tr>
        <tr><td>Moxifloxacin (Mfx)</td><td>${d.Mfx}</td></tr>
        <tr><td>Bedaquiline (Bdq)</td><td>${d.Bdq1}<br>${d.Bdq2}</td></tr>
        <tr><td>Clofazimine (Cfz)</td><td>${d.Cfz}</td></tr>
        <tr><td>Cycloserine (Cs)<sup style="color:#FFD700;">3</sup></td><td>${d.Cs}</td></tr>
        <tr><td>Linezolid (Lzd)</td><td>${d.Lzd}</td></tr>
        <tr><td>Delamanid (Dlm)</td><td>${d.Dlm}</td></tr>
        <tr><td>Amikacin (Am)<sup style="color:#FFD700;">1</sup></td><td>${d.Am}</td></tr>
        <tr><td>Pyrazinamide (Z)</td><td>${d.Z}</td></tr>
        <tr><td>Ethionamide (Eto)<sup style="color:#FFD700;">3</sup></td><td>${d.Eto}</td></tr>
        <tr><td>Na-PAS (60% w/v)<sup style="color:#FFD700;">2,3</sup></td><td>${d.PAS}</td></tr>
        <tr><td>Ethambutol (E)</td><td>${d.E}</td></tr>
        <tr><td>Imipenem-Cilastatin (Imp-Cln)<sup style="color:#FFD700;">3</sup></td><td>${d.ImpCln}</td></tr>
        <tr><td>Meropenem (Mpm)<sup style="color:#FFD700;">3</sup></td><td>${d.Mpm}</td></tr>
        <tr><td>Amoxicillin-Clavulanate (Amx-Clv)</td><td>${d.AmxClv}</td></tr>
        <tr><td>Pyridoxine (Pdx)</td><td>${d.Pdx}</td></tr>
      </tbody>
    </table>

    <p style="font-size:16px; font-weight:bold; color:#FFD700; margin-top:10px;">
      1. For adults >60 yrs, dose of SLI should be reduced to 10 mg/kg (max 750 mg)<br>
      2. Patients receiving PAS with 80% weight/volume, the dose will be changed to 7.5 gm (16-29 kg); 10 gm (30- 45 Kg); 12 gm (46-70 Kg) and 16 gm (70 kg and above)<br>
      3. Drugs can be given in divided doses in a day in case of intolerance
    </p>
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
const mdrOptions = document.getElementById("mdr-options");

regimeSelect.addEventListener("change", () => {
  if (regimeSelect.value === "H mono/poly DR-TB regimen") {
    replacementQuestion.style.display = "block";
    mdrOptions.style.display = "none";
  } else if (regimeSelect.value === "MDRTB") {
    mdrOptions.style.display = "block";
    replacementQuestion.style.display = "none";
    replacementOptions.style.display = "none";
  } else {
    replacementQuestion.style.display = "none";
    replacementOptions.style.display = "none";
    mdrOptions.style.display = "none";
  }
});

replacementAllowed.addEventListener("change", () => {
  if (replacementAllowed.value === "no") {
    replacementOptions.style.display = "block";
  } else {
    replacementOptions.style.display = "none";
  }
});

/* ---------- DOWNLOAD FUNCTION ---------- */
/* ---------- DOWNLOAD PDF FUNCTION ---------- */
document.getElementById("downloadBtn").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const output = document.getElementById("output");
  const title = output.querySelector("h3") ? output.querySelector("h3").innerText : "TB Report";
  const info = output.querySelector("p") ? output.querySelector("p").innerText : "";

  const tables = output.querySelectorAll("table");
  if (!tables.length) {
    alert("⚠ No report table to download!");
    return;
  }

  // Add Title + patient info
  doc.setFontSize(16);
  doc.text(title, 14, 20);
  doc.setFontSize(11);
  doc.text(info, 14, 28);

  let yPos = 35; // initial Y position

  tables.forEach((table, idx) => {
    // ✅ Check if previous element is an <h4> (section heading)
    let prevElem = table.previousElementSibling;
    if (prevElem && prevElem.tagName === "H4") {
      doc.setFontSize(13);
      doc.setFont(undefined, "bold");
      doc.text(prevElem.innerText, 14, yPos);
      yPos += 6; // space after heading
    }

    // ✅ Export table
    doc.autoTable({
      html: table,
      startY: yPos,
      theme: "grid",
      headStyles: { fillColor: [0, 123, 255], textColor: 255 },
      styles: { fontSize: 10 }
    });

    yPos = doc.lastAutoTable.finalY + 8;

    // ✅ Check if next sibling element is a note (<p>)
    let nextElem = table.nextElementSibling;
    if (nextElem && nextElem.tagName === "P") {
      doc.setFontSize(12);
      doc.setFont(undefined, "normal");
      doc.setTextColor(200, 0, 0); // red for visibility
      doc.text(nextElem.innerText, 14, yPos);
      yPos += 10;
      doc.setTextColor(0, 0, 0); // reset to black
    }
  });

  doc.save("TB_Regimen_dosage.pdf");
});

