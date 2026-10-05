const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");

menuButton.addEventListener("click", () => {
  const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isExpanded));
  menuButton.setAttribute("aria-label", isExpanded ? "Menü öffnen" : "Menü schließen");
  navigation.classList.toggle("is-open", !isExpanded);
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Menü öffnen");
    navigation.classList.remove("is-open");
  }
});

const contactForm = document.querySelector("#contact-form");
const submitDialog = document.querySelector("#submit-dialog");
const submitDialogTitle = document.querySelector("#submit-dialog-title");
const submitDialogMessage = document.querySelector("#submit-dialog-message");
const formNote = document.querySelector("#form-note");
const submitButton = contactForm.querySelector('[type="submit"]');
const defaultButtonText = submitButton.textContent;

document.querySelector("[data-close-dialog]").addEventListener("click", () => {
  submitDialog.close();
});

submitDialog.addEventListener("click", (event) => {
  if (event.target === submitDialog) {
    submitDialog.close();
  }
});

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) {
    return;
  }

  submitButton.disabled = true;
  submitButton.setAttribute("aria-busy", "true");
  submitButton.textContent = "Wird gesendet ...";
  formNote.textContent = "Ihre Nachricht wird gerade versendet.";

  try {
    const response = await fetch("https://formsubmit.co/ajax/mario.haselsteiner@gmx.at", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        ...Object.fromEntries(new FormData(contactForm)),
        _subject: "Anfrage Youngtimertechnik",
        _captcha: "false",
      }),
    });
    const result = await response.json();

    if (!response.ok || (result.success !== true && result.success !== "true")) {
      throw new Error("Der Formularanbieter hat die Anfrage nicht angenommen.");
    }

    contactForm.reset();
    submitDialogTitle.textContent = "Nachricht gesendet";
    submitDialogMessage.textContent = "Vielen Dank für Ihre Anfrage. Wir melden uns so bald wie möglich.";
    formNote.textContent = "Ihre Nachricht wurde versendet.";
  } catch {
    submitDialogTitle.textContent = "Versand nicht möglich";
    submitDialogMessage.textContent = "Ihre Nachricht konnte gerade nicht versendet werden. Bitte versuchen Sie es später erneut oder schreiben Sie direkt an mario.haselsteiner@gmx.at.";
    formNote.textContent = "Der Versand ist fehlgeschlagen. Ihre Eingaben bleiben erhalten.";
  } finally {
    submitButton.disabled = false;
    submitButton.removeAttribute("aria-busy");
    submitButton.textContent = defaultButtonText;
    submitDialog.showModal();
  }
});