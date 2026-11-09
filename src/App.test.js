import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("renders the hero and every Kapsy chapter", () => {
  render(<App />);
  expect(screen.getByRole("heading", { level: 1, name: "Bhavesh Ahalani" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "One router behind every AI call." })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "270 tools. A consent gate on every one." })).toBeInTheDocument();
});

test("opening a company shows its full resume entry and closes the previous one", () => {
  render(<App />);
  const soroco = screen.getByRole("button", { name: /Soroco/ });
  const tcs = screen.getByRole("button", { name: /TCS/ });

  fireEvent.click(soroco);
  expect(soroco).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByText(/15\+ to under 5/)).toBeInTheDocument();

  fireEvent.click(tcs);
  expect(tcs).toHaveAttribute("aria-expanded", "true");
  expect(soroco).toHaveAttribute("aria-expanded", "false");
});
