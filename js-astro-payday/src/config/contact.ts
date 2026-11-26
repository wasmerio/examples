export const contact = {
  title: "Talk to the Payday team",
  lead: "Tell us about your team and where you pay people. A payroll specialist reads every message, usually the same day.",
  /**
   * Read as "I'd like to <label>". `value` is what the form sends; link to
   * `/contact/?topic=<value>` to preselect one.
   */
  topics: [
    { value: "demo", label: "book a demo" },
    { value: "sales", label: "talk about pricing" },
    { value: "switch", label: "move our payroll to Payday" },
    { value: "security", label: "start a security review" },
    { value: "support", label: "get help with my account" },
    { value: "press", label: "ask a press question" },
  ],
  messageLabel: "Tell us about your team",
  messagePlaceholder: "How many people, which countries, and how you run payroll today.",
  teamSizes: ["1 to 50 people", "51 to 200", "201 to 1,000", "More than 1,000"],
  routesTitle: "Or write to a team",
  routes: [
    { label: "Sales", email: "sales@example.com" },
    { label: "Support", email: "support@example.com" },
    { label: "Security", email: "security@example.com" },
    { label: "Press", email: "press@example.com" },
  ],
  officesTitle: "Offices",
  offices: [
    { city: "Lisbon", address: ["Avenida da Liberdade 110", "1250-146 Lisboa"] },
    { city: "New York", address: ["55 Water Street, Floor 9", "New York, NY 10041"] },
  ],
};
