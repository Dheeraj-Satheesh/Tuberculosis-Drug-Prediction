// Gender-based visibility for Pregnant & Lactating
document.getElementById("gender").addEventListener("change", function () {
    const gender = this.value.toLowerCase();
    const preg = document.getElementById("pregnant-section");
    const lact = document.getElementById("lactating-section");

    if (gender === "female") {
        preg.style.display = "block";
        lact.style.display = "block";
    } else {
        preg.style.display = "none";
        lact.style.display = "none";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const page1 = document.getElementById("page1");
    const page2 = document.getElementById("page2");
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");
    const form = document.getElementById("patient-form");
    const output = document.getElementById("output");

    // Navigation
    nextBtn.addEventListener("click", () => {
        page1.style.display = "none";
        page2.style.display = "block";
    });

    prevBtn.addEventListener("click", () => {
        page2.style.display = "none";
        page1.style.display = "block";
    });

    // On final submit → predict regimen
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Patient details
        const name = document.getElementById("name").value;
        const age = parseInt(document.getElementById("age").value);
        const gender = document.getElementById("gender").value;
        const pregnant = document.getElementById("pregnant").value;
        const lactating = document.getElementById("lactating").value;
        const confirmed = document.getElementById("confirmed").value;

        // DST Results
        const R = document.getElementById("R").value;
        const HkatG = document.getElementById("HkatG").value;
        const HinhA = document.getElementById("HinhA").value;
        const Lfx = document.getElementById("Lfx").value;
        const Mfx05 = document.getElementById("Mfx05").value;
        const Mfx20 = document.getElementById("Mfx20").value;
        const SLI = document.getElementById("SLI").value;
        const E = document.getElementById("E").value;
        const Z = document.getElementById("Z").value;
        const Lzd = document.getElementById("Lzd").value;
        const Cs = document.getElementById("Cs").value;
        const Cfz = document.getElementById("Cfz").value;
        const Dim = document.getElementById("Dim").value;
        const Bdq = document.getElementById("Bdq").value;
        const Eto = document.getElementById("Eto").value;
        const PAS = document.getElementById("PAS").value;
        const Pa = document.getElementById("Pa").value;

        // ------------------ Prediction Logic ------------------
        // Predict regimen
        let regimen = "Not applicable";

        // ---- DSTB: Drug Susceptible TB ----
        if (
            confirmed === "Yes" &&
            R === "No" &&
            HkatG === "No" &&
            HinhA === "No" &&
            Lfx === "No" &&
            Mfx05 === "No" &&
            Mfx20 === "No" &&
            SLI === "No" &&
            E === "No" &&
            Z === "No" &&
            Lzd === "No" &&
            Cs === "No" &&
            Cfz === "No" &&
            Dim === "No" &&
            Bdq === "No" &&
            Eto === "No" &&
            PAS === "No" &&
            Pa === "No"
        ) {
            regimen = "Drug Susceptible TB";
        }
        // ---- H Mono/Poly Resistance ----
        else if ((HkatG === "Yes" || HinhA === "Yes") && Lfx === "No" && Z === "No" && R === "No") {
            regimen = "H Mono/Poly DRTB Regimen";
        }

        // ---- Modified H + Lfx ----
        else if ((HkatG === "Yes" || HinhA === "Yes") && Lfx === "Yes" && Z === "No" && R === "No") {
            regimen = "Modified H Mono/Poly (Lfx) DRTB Regimen";
        }

        // ---- Modified H + Z ----
        else if ((HkatG === "Yes" || HinhA === "Yes") && Z === "Yes" && Lfx === "No" && R === "No") {
            regimen = "Modified H Mono/Poly (Z) DRTB Regimen";
        }

        // ---- Modified H + Lfx + Z ----
        else if ((HkatG === "Yes" || HinhA === "Yes") && Lfx === "Yes" && Z === "Yes" && R === "No") {
            regimen = "Modified H Mono/Poly (Lfx & Z) DRTB Regimen";
        }

        // ---- Special case: Pregnant + Lactating + ≥14 yrs ----
        else if (
            age >= 14 &&
            confirmed === "Yes" &&
            R === "Yes" &&
            pregnant === "Yes" &&
            lactating === "Yes"
        ) {
            if (HkatG === "Yes" && HinhA === "Yes") {
                regimen = "Shorter Oral Bdq Regimen with Lzd (Pregnant + Lactating)";
            } else {
                regimen = "Shorter Oral Bdq Regimen with Eto (Pregnant + Lactating)";
            }
        }

        // ---- BPaLM: ≥14 yrs, Confirmed, R Resistant ----
        else if (confirmed === "Yes" && R === "Yes" && age >= 14) {
            regimen = "BPaLM Regimen";
        }

        // ---- Shorter Oral Bdq Regimens (<14 yrs, R resistant) ----
        else if (
            age < 14 &&
            confirmed === "Yes" &&
            R === "Yes" &&
            HkatG === "Yes" &&
            HinhA === "Yes"
        ) {
            regimen = "Shorter Oral Bdq Regimen with Lzd";
        }
        else if (
            age < 14 &&
            confirmed === "Yes" &&
            R === "Yes"
        ) {
            regimen = "Shorter Oral Bdq Regimen with Eto";
        }




        // ------------------ Show Output ------------------
        output.innerHTML = `
           <h3 style="color:red; text-shadow: 0 0 6px rgba(255, 0, 0, 0.7);">Predicted Regimen</h3>
            <p><b>Name:</b> ${name}</p>
            <p><b>Age:</b> ${age} years</p>
            <p><b>Gender:</b> ${gender}</p>
            <p style="color:#ffdd57; font-size:1.2rem; margin-top:10px;">
                ✅ Recommended Regimen: <b>${regimen}</b>
            </p>
        `;
        // Trigger slide-in animation each submit
        output.classList.remove("slide-in"); // reset
        void output.offsetWidth; // trick: reflow to restart animation
        output.classList.add("slide-in");
    });
});
