import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Tracker from "./components/Tracker";

describe("Tracker Component", () => {

  beforeEach(() => {
    localStorage.clear();
  });

  test("renders 30 day boxes", () => {
    render(<Tracker />);

    const day1 = screen.getByTestId("day-1");
    const day30 = screen.getByTestId("day-30");

    expect(day1).toBeInTheDocument();
    expect(day30).toBeInTheDocument();
  });

  test("clicking a day updates progress", () => {
    render(<Tracker />);

    const day1 = screen.getByTestId("day-1");

    fireEvent.click(day1);

    expect(screen.getByText(/1 \/ 30 Hari/)).toBeInTheDocument();
  });

  test("click saves data to localStorage", () => {
    render(<Tracker />);

    const day1 = screen.getByTestId("day-1");

    fireEvent.click(day1);

    const saved = JSON.parse(localStorage.getItem("ramadanTracker"));

    expect(saved["1"]).toBe(1);
  });

  test("click twice cycles level", () => {
    render(<Tracker />);

    const day1 = screen.getByTestId("day-1");

    fireEvent.click(day1); // level 1
    fireEvent.click(day1); // level 2

    const saved = JSON.parse(localStorage.getItem("ramadanTracker"));

    expect(saved["1"]).toBe(2);
  });

});