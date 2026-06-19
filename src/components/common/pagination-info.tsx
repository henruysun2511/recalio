export const PaginationInfo = ({
    page = 1,
    limit = 10,
    totalItems = 0,
    currentLength = 0,
    label = "items",
    className = "text-sm text-text-muted",
}: {
    page?: number;
    limit?: number;
    totalItems?: number;
    currentLength?: number;
    label?: string;
    className?: string;
}) => {
    const from = currentLength > 0 ? (page - 1) * limit + 1 : 0;
    const to = Math.min(page * limit, totalItems);

    return (
        <p className={className}>
            Showing <span className="font-medium">{from}</span> to{" "}
            <span className="font-medium">{to}</span> of{" "}
            <span className="font-medium">{totalItems}</span> {label}
        </p>
    );
};
