(function () {
  "use strict";

  const messages = [
    {
      message: "%cHold Up!",
      style: "color: #5955B2; font-size: 50px; font-weight: bold; text-shadow: 2px 2px black;",
    },
    {
      message: "If someone tells you to copy/paste something here, you have an 11/10 chance that you are being scammed.",
    },
    {
      message: "%cPasting anything here could give an attacker access to your account.",
      style: "color: #EF0103; font-size: 15px; font-weight: bold;",
    },
    {
      message: "Unless you really know what you're doing, close this page and stay safe.",
    },
    {
      message: `If you really understand what you are doing, you should work with us. Check out our form: %c${window.location.origin}/contact`,
    },
  ];

  messages.forEach(({ message, style = "" }) => console.log(message, style));
})();
