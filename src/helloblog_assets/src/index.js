import { helloblog } from "../../declarations/helloblog";

document.getElementById("clickMeBtn").addEventListener("click", async () => {
  const name = document.getElementById("name").value.toString();
  // Interact with helloblog actor, calling the greet method
  const greeting = await helloblog.greet(name);

  document.getElementById("greeting").innerText = greeting;
});
