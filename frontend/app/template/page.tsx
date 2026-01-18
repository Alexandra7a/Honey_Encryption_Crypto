"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../user-context";

export default function DashboardPage() {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const { userData, setUserData } = useUser();

  useEffect(() => {
    if (!userData) {
      router.replace("/login");
    }
  }, [router, userData]);



  const [notifications, setNotifications] = useState([
    { text: "New login from Chrome on Windows", time: "2h ago", icon: "💻", read: false },
    { text: "Monthly statement available", time: "1d ago", icon: "📄", read: false },
    { text: "Payment reminder: Electricity bill", time: "3d ago", icon: "⚡", read: false },
  ]);

  const news = [
    {
      title: "Stock Market Hits Record High",
      source: "Financial Times",
      summary:
        "Global markets surged today as tech stocks led the rally, with the S&P 500 hovering near the 6,940 mark and the Nasdaq Composite testing 23,500. This momentum is fueled by massive capital expenditure from AI titans like Taiwan Semiconductor (TSMC), which recently committed to a $250 billion U.S. manufacturing deal. Despite a slight Friday slip due to long-weekend profit-taking, investor confidence remains high as the 'AI supercycle' is estimated to drive earnings growth of 13-15% throughout 2026.",
    },
    {
      title: "Fed Announces Interest Rate Update",
      source: "Reuters",
      summary:
        "The Federal Reserve is maintaining a 'restrictive' but nimble stance as internal debates over leadership transition intensify ahead of Chair Powell’s term ending in May. Fed Vice Chair Michelle Bowman recently signaled a readiness to cut rates further if the labor market—which has become increasingly fragile—shows signs of a sudden downturn. Currently, markets are pricing in a 50-basis-point cut by the spring, though 'sticky' inflation near 3% remains a primary hurdle to aggressive easing.",
    },
    {
      title: "Top 5 Investment Strategies for 2026",
      source: "Bloomberg",
      summary:
        "Experts recommend a balanced approach with equities, bonds, and alternative investments. Diversification and risk management remain key to achieving steady returns in volatile markets. Investment experts for 2026 are prioritizing 'Sanaenomics' plays in Japan and infrastructure-heavy sectors in the U.S. to capture the next phase of the AI revolution.",
    },
    {
      title: "Cryptocurrency Market Volatility",
      source: "CoinDesk",
      summary:
        "Bitcoin (BTC) recently touched a peak of $97,538, supported by the emerging trend of U.S. states like New Hampshire and Texas establishing formal Bitcoin reserves. However, the market remains volatile, with a 24% drawdown from recent October highs. The spotlight in 2026 has shifted toward Solana (SOL) and its Alpenglow upgrade, as institutional interest pivots toward programmable blockchains that can handle the growing $4 trillion market for tokenized stablecoins and treasuries.",
    },
    {
      title: "Real Estate Market Trends",
      source: "Forbes",
      summary:
        "Housing prices in major cities continue to rise, creating challenges for first-time buyers. Experts predict stabilization in certain regions while others may see further appreciation. Institutional investors are pivoting toward 'niche operational sectors' like student housing and data center real estate, which offer higher yields than traditional office spaces.",
    },
    {
      title: "Tech Stocks Under Scrutiny",
      source: "CNBC",
      summary:
        "Major tech companies face regulatory pressures that could impact stock performance. Investors should pay attention to policy changes and legal developments affecting the sector. While chipmakers like AMD and Micron see gains from internal share buybacks, the broader sector faces scrutiny over productivity and AI adoption.",
    },
    {
      title: "Global Oil Prices Increase",
      source: "Reuters",
      summary:
        "Rising demand and geopolitical tensions have pushed crude oil prices higher. Brent crude is currently holding around $61-$63 per barrel, a significant drop from 2025 levels, as a projected supply glut looms for 2026. Analysts expect U.S. gas prices to average $2.90 per gallon this year, providing some relief to consumers.",
    },
    {
      title: "Banking Sector Overview",
      source: "Wall Street Journal",
      summary:
        "Banks are reporting strong earnings but face challenges from rising interest rates. Analysts suggest focusing on liquidity and risk management as key priorities for investors. The 2026 outlook is clouded by the 'Basel III Endgame' rules, requiring more capital against risks.",
    },
    {
      title: "Emerging Markets Growth",
      source: "Bloomberg",
      summary:
        "Emerging economies show robust growth potential despite global uncertainties. India remains the global growth leader for 2026 with a projected 6.6% GDP expansion, while China faces structural headwinds from a cooling property sector and aging demographics. Investors are focusing on sectors such as technology, infrastructure, and energy.",
    },
    {
      title: "Sustainable Investing Trends",
      source: "Financial Times",
      summary:
        "Green investments and ESG-focused funds are gaining popularity. Investors are increasingly considering environmental and social governance factors in their portfolio decisions. The market for green bonds is expanding into new areas like water security and biodiversity.",
    },
  ];

  const handleLogout = () => {
    setUserData(null);
    router.replace("/login");
  };

  const handleNotificationClick = (index: number) => {
    const newNotifications = [...notifications];
    newNotifications[index].read = true;
    setNotifications(newNotifications);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* LEFT SIDEBAR */}
      <aside className="w-56 p-6 flex flex-col gap-3">
        <h2 className="text-xl font-semibold mb-4">Bank Menu</h2>
        <ul className="flex flex-col gap-3">
          {[
            { label: "📄 Transactions", path: "/transactions" },
            { label: "💸 Transfers", path: "/transfers" },
            { label: "📈 Investments", path: "/investments" },
            { label: "🧾 Bills & Payments", path: "/bills" },
          ].map((item) => (
            <li
              key={item.path}
              onClick={() => router.push(item.path)}
              className="cursor-pointer bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition font-medium text-gray-700 text-left"
            >
              {item.label}
            </li>
          ))}
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold">Welcome, {userData?.full_name || "User"}</h1>

        {/* Balance Card */}
        <div className="mt-6 bg-blue-50 p-6 rounded-2xl shadow-md max-w">
          <h2 className="text-xl  mb-2">Account Balance</h2>
          <p className="text-3xl mb-1">
            {userData?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {userData?.currency || "RON"}
          </p>
          <p className="text-gray-600">
            Your balance reflects all completed transactions as of today.
          </p>
        </div>

        {/* Financial News */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-6">Financial News & Insights</h2>
          <div className="flex flex-col gap-4">
            {news.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
              >
                <p className="font-bold text-lg mb-1">{item.title}</p>
                <p className="text-gray-500 text-sm mb-2">{item.source}</p>
                <p className="text-gray-700 text-sm">{item.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* RIGHT SIDEBAR */}
      <aside className="w-80 p-6 flex flex-col gap-3">
        <h3 className="text-xl font-semibold mb-4">Settings</h3>
        <ul className="flex flex-col gap-3">
          <li
            onClick={() => router.push("/settings")}
            className="cursor-pointer bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition font-medium text-gray-700 text-left"
          >
            ⚙️ Settings
          </li>

          {/* Notifications */}
          <li
            className="cursor-pointer bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition font-medium text-gray-700 text-left"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <div className="flex justify-between items-center">
              <span>🔔 Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>

            {showNotifications && (
              <ul className="mt-2 flex flex-col gap-2 max-h-64 overflow-y-auto">
                {notifications.map((note, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleNotificationClick(idx)}
                    className={`flex items-start gap-3 bg-gray-50 p-3 rounded-lg shadow hover:shadow-md transition cursor-pointer ${
                      !note.read ? "font-bold" : "font-normal text-gray-600"
                    }`}
                  >
                    <span className="text-xl">{note.icon}</span>
                    <div className="flex flex-col">
                      <p>{note.text}</p>
                      <span className="text-gray-400 text-xs">{note.time}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li
            className="cursor-pointer bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition font-medium text-blue-600 text-left"
            onClick={handleLogout}
          >
            🚪 Logout
          </li>
        </ul>
      </aside>
    </div>
  );
}
