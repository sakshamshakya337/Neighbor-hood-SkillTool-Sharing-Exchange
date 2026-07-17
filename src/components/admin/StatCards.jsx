import {
  Users,
  Wrench,
  CalendarCheck,
  CreditCard,
} from "lucide-react";

export default function StatCards({ dashboard }) {
  const cards = [
    {
      title: "Users",
      value: dashboard.totalUsers,
      icon: Users,
    },
    {
      title: "Tools",
      value: dashboard.totalTools,
      icon: Wrench,
    },
    {
      title: "Bookings",
      value: dashboard.totalBookings,
      icon: CalendarCheck,
    },
    {
      title: "Payments",
      value: dashboard.totalPayments,
      icon: CreditCard,
    },
  ];

  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mt-8">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-slate-500">{card.title}</p>
                <h2 className="text-4xl font-bold mt-2">
                  {card.value}
                </h2>
              </div>

              <div className="bg-blue-100 p-4 rounded-full">
                <Icon className="text-blue-600" size={30} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}