"use client";

import { useState, useEffect } from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import { usePathname } from "next/navigation";

const tourSteps: Step[] = [
  {
    target: '[data-tour="monthly-spending"]',
    content: "Your total monthly subscription costs at a glance. This updates automatically as you add or modify subscriptions.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="active-subscriptions"]',
    content: "Track how many active subscriptions you're currently managing. This includes both active and trial subscriptions.",
  },
  {
    target: '[data-tour="annual-projection"]',
    content: "Your projected annual spending based on current subscriptions. This helps you understand the true cost of all your tools over time.",
  },
  {
    target: '[data-tour="potential-savings"]',
    content: "Discover how much you could save! This aggregates all identified savings opportunities like unused subscriptions and cheaper alternatives.",
  },
  {
    target: '[data-tour="spending-trend"]',
    content: "Visualize your spending patterns over time. Spot trends and understand how your subscription costs evolve month by month.",
  },
  {
    target: '[data-tour="category-breakdown"]',
    content: "See where your money goes by category. This helps identify which types of tools consume most of your budget.",
  },
  {
    target: '[data-tour="upcoming-renewals"]',
    content: "Never miss a renewal! This shows your next renewals sorted by date, with urgent renewals highlighted.",
  },
  {
    target: '[data-tour="recent-alerts"]',
    content: "Stay informed with important notifications about price changes, unused subscriptions, and budget warnings.",
  },
  {
    target: '[data-tour="budget-status"]',
    content: "Monitor your spending against set budgets. Visual indicators warn you when approaching or exceeding limits.",
  },
  {
    target: '[data-tour="savings-opportunities"]',
    content: "Smart recommendations to reduce costs. Each opportunity shows potential savings you can achieve.",
  },
  {
    target: '[data-tour="nav-subscriptions"]',
    content: "Manage all your subscriptions here. View, edit, add, or cancel subscriptions in one centralized location.",
  },
  {
    target: '[data-tour="nav-alerts"]',
    content: "Access all your notifications and alerts. Stay on top of renewals, price changes, and optimization opportunities.",
  },
  {
    target: '[data-tour="nav-budget"]',
    content: "Set and track spending budgets. Create overall limits or category-specific budgets to control costs.",
  },
  {
    target: '[data-tour="nav-savings"]',
    content: "Explore detailed savings insights. Find duplicates, unused tools, and more affordable alternatives.",
  },
  {
    target: '[data-tour="nav-team"]',
    content: "Collaborate with your team. Manage members, assign subscriptions, and track team-wide spending.",
  },
];

interface ProductTourProps {
  runTour?: boolean;
  onComplete?: () => void;
}

export function ProductTour({ runTour = false, onComplete }: ProductTourProps) {
  const [run, setRun] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (runTour && pathname === "/dashboard") {
      const timer = setTimeout(() => setRun(true), 500);
      return () => clearTimeout(timer);
    }
  }, [runTour, pathname]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      if (onComplete) {
        onComplete();
      }
    }
  };

  if (pathname !== "/dashboard") {
    return null;
  }

  return (
    <Joyride
      steps={tourSteps}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: "oklch(0.55 0.24 270)",
          textColor: "oklch(0.20 0.01 280)",
          backgroundColor: "oklch(1 0 0)",
          overlayColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: 12,
          padding: 20,
        },
        tooltipContainer: {
          textAlign: "left",
        },
        buttonNext: {
          backgroundColor: "oklch(0.55 0.24 270)",
          borderRadius: 8,
          padding: "8px 16px",
          fontSize: 14,
          fontWeight: 500,
        },
        buttonBack: {
          color: "oklch(0.50 0.02 280)",
          marginRight: 8,
          fontSize: 14,
        },
        buttonSkip: {
          color: "oklch(0.50 0.02 280)",
          fontSize: 14,
        },
      }}
      locale={{
        back: "Back",
        close: "Close",
        last: "Finish Tour",
        next: "Next",
        skip: "Skip Tour",
      }}
    />
  );
}
