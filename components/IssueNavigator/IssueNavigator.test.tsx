import React from "react";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {IssueNavButtons} from "@/components/IssueNavigator/IssueNavButtons";
import {IssueNavSummary} from "@/components/IssueNavigator/IssueNavSummary";
import {IssueNavigator} from "@/components/IssueNavigator/IssueNavigator";


describe("IssueNavSummary", () => {
    it("renders the current page and total page count", () => {
        render(<IssueNavSummary currentPage={3} pageCount={12}/>);
        expect(screen.getByText("Page 3 of 12")).toBeInTheDocument();
    });

    it("returns null when pageCount is null", () => {
        const {container} = render(<IssueNavSummary currentPage={1} pageCount={null}/>);
        expect(container).toBeEmptyDOMElement();
    });
});

describe("IssueNavButtons", () => {
    const onNavigate = jest.fn();

    beforeEach(() => {
        onNavigate.mockClear();
    });

    it("shows the issue position label when the current page has issues", () => {
        render(
            <IssueNavButtons
                currentPage={5}
                pageNumbersWithIssues={[2, 5, 8, 11]}
                onNavigate={onNavigate}
            />,
        );
        expect(screen.getByText("Issue 2 of 4")).toBeInTheDocument();
    });

    it("shows 'Jump to issues' when the current page has no issues", () => {
        render(
            <IssueNavButtons
                currentPage={6}
                pageNumbersWithIssues={[2, 5, 8, 11]}
                onNavigate={onNavigate}
            />,
        );
        expect(screen.getByText("Jump to issues")).toBeInTheDocument();
    });

    it("disables the previous button when there are no earlier issue pages", () => {
        render(
            <IssueNavButtons
                currentPage={2}
                pageNumbersWithIssues={[2, 8, 11]}
                onNavigate={onNavigate}
            />,
        );
        expect(
            screen.getByRole("button", {name: /previous page with issues/i}),
        ).toBeDisabled();
    });

    it("disables the next button when there are no later issue pages", () => {
        render(
            <IssueNavButtons
                currentPage={11}
                pageNumbersWithIssues={[2, 5, 11]}
                onNavigate={onNavigate}
            />,
        );
        expect(
            screen.getByRole("button", {name: /next page with issues/i}),
        ).toBeDisabled();
    });

    it("disables both buttons when there are no issue pages at all", () => {
        render(
            <IssueNavButtons
                currentPage={3}
                pageNumbersWithIssues={[]}
                onNavigate={onNavigate}
            />,
        );
        expect(
            screen.getByRole("button", {name: /previous page with issues/i}),
        ).toBeDisabled();
        expect(
            screen.getByRole("button", {name: /next page with issues/i}),
        ).toBeDisabled();
    });

    it("calls onNavigate with the nearest previous issue page", async () => {
        render(
            <IssueNavButtons
                currentPage={10}
                pageNumbersWithIssues={[2, 6, 10]}
                onNavigate={onNavigate}
            />,
        );
        await userEvent.click(
            screen.getByRole("button", {name: /previous page with issues/i}),
        );
        expect(onNavigate).toHaveBeenCalledWith(6);
        expect(onNavigate).toHaveBeenCalledTimes(1);
    });

    it("calls onNavigate with the nearest next issue page", async () => {
        render(
            <IssueNavButtons
                currentPage={5}
                pageNumbersWithIssues={[2, 5, 8, 11]}
                onNavigate={onNavigate}
            />,
        );
        await userEvent.click(
            screen.getByRole("button", {name: /next page with issues/i}),
        );
        expect(onNavigate).toHaveBeenCalledWith(8);
        expect(onNavigate).toHaveBeenCalledTimes(1);
    });

    it("does not call onNavigate when a disabled button is clicked", async () => {
        render(
            <IssueNavButtons
                currentPage={2}
                pageNumbersWithIssues={[2, 8]}
                onNavigate={onNavigate}
            />,
        );
        await userEvent.click(
            screen.getByRole("button", {name: /previous page with issues/i}),
        );
        expect(onNavigate).not.toHaveBeenCalled();
    });
});


describe("IssueNavigator", () => {
    const jumpToPage = jest.fn();

    const defaultProps = {
        currentPage: 3,
        pageCount: 10,
        pageNumbersWithIssues: [1, 3, 7],
        jumpToPage,
    };

    beforeEach(() => {
        jumpToPage.mockClear();
    });

    it("renders the page summary", () => {
        render(<IssueNavigator {...defaultProps} />);
        expect(screen.getByText("Page 3 of 10")).toBeInTheDocument();
    });

    it("renders the correct issue position", () => {
        render(<IssueNavigator {...defaultProps} />);
        expect(screen.getByText("Issue 2 of 3")).toBeInTheDocument();
    });

    it("forwards jumpToPage to the nav buttons", async () => {
        render(<IssueNavigator {...defaultProps} />);
        await userEvent.click(
            screen.getByRole("button", {name: /next page with issues/i}),
        );
        expect(jumpToPage).toHaveBeenCalledWith(7);
    });
});
