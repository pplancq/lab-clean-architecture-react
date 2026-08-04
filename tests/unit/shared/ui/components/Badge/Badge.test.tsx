import compactDiscIcon from "@pplancq/shelter-ui-icon/icon/compact-disc.svg";
import gameStructureIcon from "@pplancq/shelter-ui-icon/icon/game-structure.svg";
import { Badge } from "@Shared/ui/components/Badge/Badge";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

const anyIcon = gameStructureIcon as string;
const discIcon = compactDiscIcon as string;

describe("Badge", () => {
  describe("rendering", () => {
    it("should render its children as label text", async () => {
      render(<Badge icon={anyIcon}>PS5</Badge>);

      await waitFor(() => {
        expect(screen.getByText("PS5")).toBeInTheDocument();
      });
    });

    it("should apply the badge and primary CSS classes by default", async () => {
      render(
        <Badge data-testid="badge" icon={anyIcon}>
          PS5
        </Badge>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("badge")).toHaveClass("badge", "primary");
      });
    });
  });

  describe("color prop", () => {
    it.each(["primary", "secondary", "tertiary", "info", "success", "critical", "warning"] as const)(
      "should apply %s color class",
      async (color) => {
        render(
          <Badge data-testid="badge" icon={anyIcon} color={color}>
            Label
          </Badge>,
        );
        await waitFor(() => {
          expect(screen.getByTestId("badge")).toHaveClass(color);
        });
      },
    );
  });

  describe("customisation", () => {
    it("should forward a custom className", async () => {
      render(
        <Badge data-testid="badge" icon={anyIcon} className="my-custom-class">
          PS5
        </Badge>,
      );
      await waitFor(() => {
        expect(screen.getByTestId("badge")).toHaveClass("my-custom-class");
      });
    });

    it("should forward a custom style", async () => {
      render(
        <Badge data-testid="badge" icon={anyIcon} style={{ opacity: 0.5 }}>
          PS5
        </Badge>,
      );
      await waitFor(() => {
        expect(screen.getByTestId("badge")).toHaveStyle({ opacity: "0.5" });
      });
    });

    it("should accept any SVG as icon", async () => {
      render(
        <Badge icon={discIcon} color="success">
          Physical
        </Badge>,
      );

      await waitFor(() => {
        expect(screen.getByText("Physical")).toBeInTheDocument();
      });
    });
  });

  describe("accessibility", () => {
    it("should have an accessible description matching its label", async () => {
      render(
        <Badge data-testid="badge" icon={anyIcon}>
          PS5
        </Badge>,
      );
      await waitFor(() => {
        expect(screen.getByTestId("badge")).toHaveAccessibleDescription("PS5");
      });
    });

    it("should keep badge and color classes together", async () => {
      render(
        <Badge data-testid="badge" icon={anyIcon} color="success">
          Physical
        </Badge>,
      );
      await waitFor(() => {
        expect(screen.getByTestId("badge")).toHaveClass("badge", "success");
      });
    });

    it("should have aria-describedby pointing to the label element", async () => {
      render(
        <Badge data-testid="badge" icon={anyIcon}>
          High
        </Badge>,
      );
      await waitFor(() => {
        const badge = screen.getByTestId("badge");
        const describedById = badge.getAttribute("aria-describedby");
        expect(describedById).toBeTruthy();
        const label = screen.getByText("High");
        expect(label.id).toBe(describedById);
      });
    });

    it("should put id on the wrapper and use id-label for aria-describedby", async () => {
      render(
        <Badge data-testid="badge" id="my-badge" icon={anyIcon}>
          Title
        </Badge>,
      );
      await waitFor(() => {
        expect(screen.getByTestId("badge")).toHaveAttribute("id", "my-badge");
      });
      await waitFor(() => {
        expect(screen.getByTestId("badge")).toHaveAttribute("aria-describedby", "my-badge-label");
      });
      await waitFor(() => {
        expect(screen.getByText("Title")).toHaveAttribute("id", "my-badge-label");
      });
    });
  });
});
