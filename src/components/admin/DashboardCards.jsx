export default function DashboardCards({ dashboard }) {
  if (!dashboard) return null;

  const cards = [
    {
      title: "Users",
      value: dashboard.totalUsers,
    },
    {
      title: "Tools",
      value: dashboard.totalTools,
    },
    {
      title: "Bookings",
      value: dashboard.totalBookings,
    },
    {
      title: "Payments",
      value: dashboard.totalPayments,
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: "20px",
        marginBottom: "30px",
      }}
    >
      {cards.map((card) => (
        <div
          key={card.title}
          style={{
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <h3>{card.title}</h3>
          <h1>{card.value}</h1>
        </div>
      ))}
    </div>
  );
}