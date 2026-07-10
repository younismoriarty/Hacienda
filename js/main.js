document.addEventListener("DOMContentLoaded", () => {

    // ==========================================================================
    // GOOGLE SHEETS LEAD DELIVERY
    // ==========================================================================
    const SCRIPT_URL = ""; // ضع هنا رابط الـ Web App الخاص بجوجل سكريبت (Google Apps Script Web App URL)

    async function sendToGoogleSheets(data) {
        if (!SCRIPT_URL) {
            console.warn("Google Sheets Script URL is not configured.");
            return;
        }

        const formData = new URLSearchParams();
        formData.append("name", data.name || "");
        formData.append("phone", data.phone || "");
        formData.append("unit_type", data.unit_preference || data.unit_type || "");
        formData.append("payment_preference", data.payment_preference || "");
        formData.append("source", "لاندينج بيدج هاسيندا راس الحكمة");
        formData.append("date", new Date().toLocaleString("ar-EG"));

        try {
            await fetch(SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: formData
            });
        } catch (error) {
            console.error("Error sending data to Google Sheets:", error);
        }
    }

    // ==========================================================================
    // 0. PRELOADER — Hide after page fully loads
    // ==========================================================================
    const preloader = document.getElementById("preloader");
    const preloaderProgress = document.getElementById("preloaderProgress");

    if (preloader) {
        let prog = 0;
        const fillInterval = setInterval(() => {
            prog += Math.random() * 15;
            if (prog >= 100) {
                prog = 100;
                clearInterval(fillInterval);
            }
            if (preloaderProgress) {
                preloaderProgress.style.width = prog + "%";
            }
        }, 120);

        window.addEventListener("load", () => {
            clearInterval(fillInterval);
            if (preloaderProgress) preloaderProgress.style.width = "100%";
            setTimeout(() => {
                preloader.classList.add("hide");
                setTimeout(() => { if (document.body.contains(preloader)) preloader.remove(); }, 700);
            }, 500);
        });

        // Failsafe: hide after 4s if load never fires
        setTimeout(() => {
            if (document.body.contains(preloader)) {
                preloader.classList.add("hide");
                setTimeout(() => { if (document.body.contains(preloader)) preloader.remove(); }, 700);
            }
        }, 4000);
    }

    // ==========================================================================
    // 1. MOBILE MENU TOGGLE
    // ==========================================================================
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const mainNav = document.getElementById("mainNav");

    if (hamburgerBtn && mainNav) {
        hamburgerBtn.addEventListener("click", () => {
            mainNav.classList.toggle("active");
            hamburgerBtn.classList.toggle("active");
            const spans = hamburgerBtn.querySelectorAll("span");
            if (mainNav.classList.contains("active")) {
                spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
                spans[1].style.opacity = "0";
                spans[2].style.transform = "rotate(-45deg) translate(6px, -6px)";
            } else {
                spans[0].style.transform = "none";
                spans[1].style.opacity = "1";
                spans[2].style.transform = "none";
            }
        });

        mainNav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                mainNav.classList.remove("active");
                const spans = hamburgerBtn.querySelectorAll("span");
                spans[0].style.transform = "none";
                spans[1].style.opacity = "1";
                spans[2].style.transform = "none";
            });
        });
    }

    // ==========================================================================
    // 2. KEN BURNS HERO SLIDESHOW
    // ==========================================================================
    const heroSlides = document.querySelectorAll(".hero-slide");
    if (heroSlides.length > 1) {
        let currentSlide = 0;
        setInterval(() => {
            heroSlides[currentSlide].classList.remove("active");
            currentSlide = (currentSlide + 1) % heroSlides.length;
            heroSlides[currentSlide].classList.add("active");
        }, 6000);
    }

    // ==========================================================================
    // 3. SCROLL REVEAL ANIMATIONS
    // ==========================================================================
    const revealElements = document.querySelectorAll(".scroll-reveal");
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });
        revealElements.forEach(el => revealObserver.observe(el));
    }



    // ==========================================================================
    // 5. ANIMATED STATS COUNTER
    // ==========================================================================
    const statNumbers = document.querySelectorAll(".stat-number");
    if (statNumbers.length > 0) {
        const runCounter = (el) => {
            const target = parseFloat(el.getAttribute("data-target"));
            const duration = 2000;
            const startTime = performance.now();
            const animate = (currentTime) => {
                const progress = Math.min((currentTime - startTime) / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 3);
                const val = ease * target;
                el.textContent = target % 1 !== 0 ? val.toFixed(1) : Math.floor(val);
                if (progress < 1) requestAnimationFrame(animate);
                else el.textContent = target;
            };
            requestAnimationFrame(animate);
        };

        const statsSection = document.querySelector(".trust-stats-bar");
        if (statsSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        statNumbers.forEach(num => runCounter(num));
                        observer.unobserve(statsSection);
                    }
                });
            }, { threshold: 0.3 });
            observer.observe(statsSection);
        }
    }

    // ==========================================================================
    // 6. MULTI-STEP FORM
    // ==========================================================================
    const heroLeadForm = document.getElementById("heroLeadForm");
    if (heroLeadForm) {
        const formSteps = heroLeadForm.querySelectorAll(".form-step");
        const progressBar = document.getElementById("formProgress");
        const totalSteps = formSteps.length;
        let currentStep = 1;
        let selectedUnitType = "";
        let selectedPaymentPlan = "";

        const updateProgress = () => {
            const pct = ((currentStep - 1) / (totalSteps - 1)) * 100;
            if (progressBar) progressBar.style.width = pct + "%";
        };

        const showStep = (stepNum) => {
            formSteps.forEach(step => {
                step.classList.toggle("active", parseInt(step.getAttribute("data-step")) === stepNum);
            });
            updateProgress();
        };

        // Step 1 — Unit type buttons
        const typeBtns = heroLeadForm.querySelectorAll(".type-btn");
        const step1Next = heroLeadForm.querySelector(".form-step[data-step='1'] .next-step");
        typeBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                typeBtns.forEach(b => b.classList.remove("selected"));
                btn.classList.add("selected");
                selectedUnitType = btn.getAttribute("data-value");
                if (step1Next) step1Next.disabled = false;
            });
        });

        // Step 2 — Payment plan buttons
        const planBtns = heroLeadForm.querySelectorAll(".plan-btn");
        const step2Next = heroLeadForm.querySelector(".form-step[data-step='2'] .next-step");
        planBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                planBtns.forEach(b => b.classList.remove("selected"));
                btn.classList.add("selected");
                selectedPaymentPlan = btn.getAttribute("data-value");
                if (step2Next) step2Next.disabled = false;
            });
        });

        // Next buttons
        heroLeadForm.querySelectorAll(".next-step").forEach(btn => {
            btn.addEventListener("click", () => {
                if (currentStep < totalSteps) { currentStep++; showStep(currentStep); }
            });
        });

        // Prev buttons
        heroLeadForm.querySelectorAll(".prev-step").forEach(btn => {
            btn.addEventListener("click", () => {
                if (currentStep > 1) { currentStep--; showStep(currentStep); }
            });
        });

        // Submit via WhatsApp delivery
        heroLeadForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Populate hidden fields
            const hiddenUnit = document.getElementById("hidden-unit-pref");
            const hiddenPayment = document.getElementById("hidden-payment-pref");
            if (hiddenUnit) hiddenUnit.value = selectedUnitType;
            if (hiddenPayment) hiddenPayment.value = selectedPaymentPlan;

            // Phone validation
            const phoneInput = heroLeadForm.querySelector("input[type='tel']");
            if (phoneInput) {
                const phoneVal = phoneInput.value.trim();
                if (!/^01[0125][0-9]{8}$/.test(phoneVal)) {
                    alert("يرجى إدخال رقم هاتف مصري صحيح مكون من 11 رقم ويبدأ بـ 01");
                    phoneInput.focus();
                    return;
                }
            }

            const submitBtn = heroLeadForm.querySelector(".btn-submit");
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> جاري الإرسال...';
            }

            // Collect form data
            const formData = new FormData(heroLeadForm);
            const data = Object.fromEntries(formData.entries());
            data.unit_preference    = selectedUnitType;
            data.payment_preference = selectedPaymentPlan;

            // Send to Google Sheets and then redirect
            sendToGoogleSheets(data).then(() => {
                window.location.href = "thank-you.html";
            }).catch(() => {
                window.location.href = "thank-you.html";
            });
        });

        showStep(currentStep);
    }

    // ==========================================================================
    // 7. FILTERABLE UNITS
    // ==========================================================================
    const filterTabs = document.querySelectorAll(".filter-tab");
    const unitCards = document.querySelectorAll(".unit-card");

    if (filterTabs.length > 0 && unitCards.length > 0) {
        filterTabs.forEach(tab => {
            tab.addEventListener("click", () => {
                filterTabs.forEach(t => t.classList.remove("active"));
                tab.classList.add("active");
                const filterValue = tab.getAttribute("data-filter");
                unitCards.forEach(card => {
                    const cat = card.getAttribute("data-category");
                    if (filterValue === "all" || cat === filterValue) {
                        card.style.display = "block";
                        setTimeout(() => { card.style.opacity = "1"; card.style.transform = "scale(1)"; }, 50);
                    } else {
                        card.style.opacity = "0";
                        card.style.transform = "scale(0.9)";
                        setTimeout(() => { card.style.display = "none"; }, 300);
                    }
                });
            });
        });
    }

    // ==========================================================================
    // 8. FAQ ACCORDION
    // ==========================================================================
    document.querySelectorAll(".accordion-header").forEach(header => {
        header.addEventListener("click", () => {
            const item = header.parentElement;
            const content = header.nextElementSibling;
            const isActive = item.classList.contains("active");
            document.querySelectorAll(".accordion-item").forEach(otherItem => {
                otherItem.classList.remove("active");
                const c = otherItem.querySelector(".accordion-content");
                if (c) c.style.maxHeight = null;
            });
            if (!isActive) {
                item.classList.add("active");
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // ==========================================================================
    // 9. EXIT INTENT POPUP
    // ==========================================================================
    const exitPopupOverlay = document.getElementById("exitPopupOverlay");
    const exitPopupCloseBtn = document.getElementById("exitPopupCloseBtn");
    if (exitPopupOverlay) {
        let popupShown = sessionStorage.getItem("hacienda_popup_shown") === "true";
        const mouseEvent = (e) => {
            if (e.clientY < 30 && !popupShown) {
                exitPopupOverlay.classList.add("active");
                popupShown = true;
                sessionStorage.setItem("hacienda_popup_shown", "true");
                document.removeEventListener("mouseleave", mouseEvent);
            }
        };
        if (!popupShown) document.addEventListener("mouseleave", mouseEvent);
        if (exitPopupCloseBtn) {
            exitPopupCloseBtn.addEventListener("click", () => exitPopupOverlay.classList.remove("active"));
        }
        exitPopupOverlay.addEventListener("click", (e) => {
            if (e.target === exitPopupOverlay) exitPopupOverlay.classList.remove("active");
        });
    }

    // ==========================================================================
    // 9.5. TIMED WELCOME POPUP (20 Seconds after page load)
    // ==========================================================================
    const welcomePopupOverlay = document.getElementById("welcomePopupOverlay");
    const welcomePopupCloseBtn = document.getElementById("welcomePopupCloseBtn");
    if (welcomePopupOverlay) {
        // Always show after 20 seconds — no storage check
        setTimeout(() => {
            if (!exitPopupOverlay || !exitPopupOverlay.classList.contains("active")) {
                welcomePopupOverlay.classList.add("active");
            }
        }, 20000);

        const closeWelcome = () => welcomePopupOverlay.classList.remove("active");

        if (welcomePopupCloseBtn) {
            welcomePopupCloseBtn.addEventListener("click", closeWelcome);
        }
        welcomePopupOverlay.addEventListener("click", (e) => {
            if (e.target === welcomePopupOverlay) closeWelcome();
        });
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && welcomePopupOverlay.classList.contains("active")) closeWelcome();
        });

        // Open registration popup from cards
        document.querySelectorAll(".open-reg-popup").forEach(btn => {
            btn.addEventListener("click", () => {
                const unitVal = btn.getAttribute("data-unit");
                if (unitVal) {
                    const unitSelect = welcomePopupOverlay.querySelector("select[name='unit_type']");
                    if (unitSelect) {
                        unitSelect.value = unitVal;
                    }
                }
                welcomePopupOverlay.classList.add("active");
            });
        });
    }

    // ==========================================================================
    // 10. ALL OTHER FORMS — WhatsApp delivery
    // ==========================================================================
    document.querySelectorAll(".lead-form").forEach(form => {
        if (form.id === "heroLeadForm") return; // handled separately above

        form.addEventListener("submit", (e) => {
            e.preventDefault();

            // Phone validation
            const phoneInput = form.querySelector("input[type='tel']");
            if (phoneInput) {
                const phoneVal = phoneInput.value.trim();
                if (!/^01[0125][0-9]{8}$/.test(phoneVal)) {
                    alert("يرجى إدخال رقم هاتف مصري صحيح مكون من 11 رقم ويبدأ بـ 01");
                    phoneInput.focus();
                    return;
                }
            }

            // Loading state
            const submitBtn = form.querySelector(".btn-submit");
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> جاري الإرسال...';
            }

            // Collect form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Send to Google Sheets and then redirect
            sendToGoogleSheets(data).then(() => {
                window.location.href = "thank-you.html";
            }).catch(() => {
                window.location.href = "thank-you.html";
            });
        });
    });

    // ==========================================================================
    // 11. HEADER SCROLL BEHAVIOR
    // ==========================================================================
    const mainHeader = document.getElementById("mainHeader");
    if (mainHeader) {
        let ticking = false;
        window.addEventListener("scroll", () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (window.scrollY > 50) {
                        mainHeader.classList.add("scrolled");
                    } else {
                        mainHeader.classList.remove("scrolled");
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }



    // ==========================================================================
    // 13. URGENCY COUNTDOWN TIMER
    // ==========================================================================
    const cdDays    = document.getElementById("cdDays");
    const cdHours   = document.getElementById("cdHours");
    const cdMinutes = document.getElementById("cdMinutes");
    const cdSeconds = document.getElementById("cdSeconds");
    
    if (cdHours && cdMinutes && cdSeconds) {
        const STORAGE_KEY    = "hacienda_launch_timer_end";
        const TIMER_VERSION  = "v2_15days"; // غيّر هذه القيمة لإعادة العداد من الصفر
        const DURATION_MS    = 15 * 24 * 60 * 60 * 1000; // 15 يوم

        // إعادة العداد تلقائياً لو الـ version اتغيّر
        if (localStorage.getItem("hacienda_timer_version") !== TIMER_VERSION) {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.setItem("hacienda_timer_version", TIMER_VERSION);
        }

        let endTime = localStorage.getItem(STORAGE_KEY);
        if (!endTime) {
            endTime = Date.now() + DURATION_MS;
            localStorage.setItem(STORAGE_KEY, endTime);
        }
        endTime = parseInt(endTime);

        function updateTimer() {
            const now = Date.now();
            let remaining = endTime - now;
            if (remaining <= 0) {
                endTime = Date.now() + DURATION_MS;
                localStorage.setItem(STORAGE_KEY, endTime);
                remaining = DURATION_MS;
            }
            const days    = Math.floor(remaining / (1000 * 60 * 60 * 24));
            const hours   = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
            
            if (cdDays)    cdDays.textContent    = String(days).padStart(2, "0");
            cdHours.textContent   = String(hours).padStart(2, "0");
            cdMinutes.textContent = String(minutes).padStart(2, "0");
            cdSeconds.textContent = String(seconds).padStart(2, "0");
        }
        updateTimer();
        setInterval(updateTimer, 1000);
    }

    // ==========================================================================
    // 14. SCROLL PROGRESS BAR
    // ==========================================================================
    const scrollProgressBar = document.getElementById("scrollProgressBar");
    if (scrollProgressBar) {
        let ticking = false;
        window.addEventListener("scroll", () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollTop = window.scrollY || document.documentElement.scrollTop;
                    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
                    scrollProgressBar.style.width = Math.min(scrollPercent, 100) + "%";
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

});


// ==========================================================================
// 14. INSTALLMENT CALCULATOR (global function)
// ==========================================================================
function calculateInstallment() {
    const unitPrice    = parseFloat(document.getElementById("calcUnitType").value);
    const downPercent  = parseFloat(document.getElementById("calcDownPayment").value);
    const years        = parseInt(document.getElementById("calcYears").value);

    const downAmount   = unitPrice * (downPercent / 100);
    const remaining    = unitPrice - downAmount;
    const months       = years * 12;
    const monthly      = remaining / months;

    const fmt = (n) => n.toLocaleString("ar-EG", { maximumFractionDigits: 0 }) + " ج.م";

    document.getElementById("downPaymentResult").textContent = fmt(downAmount);
    document.getElementById("monthlyResult").textContent     = fmt(monthly);
    document.getElementById("totalResult").textContent       = fmt(unitPrice);

    // Highlight results with a pop animation
    const cards = document.querySelectorAll(".calc-result-card");
    cards.forEach(card => {
        card.style.transform = "scale(1.02)";
        setTimeout(() => { card.style.transform = ""; }, 300);
    });
    if (document.getElementById("calcResults")) {
        document.getElementById("calcResults").scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
}

