import { Home, University, Building, Globe, ChartBar } from "lucide-react";

type TabType = "domestic" | "monetary" | "corporate" | "foreign" | "global" | "technical";

interface NavigationTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {
  const tabs = [
    { id: "domestic" as TabType, label: "Domestic Economic", icon: Home },
    { id: "monetary" as TabType, label: "Monetary Policy", icon: University },
    { id: "global" as TabType, label: "Global Factors", icon: Globe },
    { id: "technical" as TabType, label: "Technical", icon: ChartBar },
  ];

  return (
    <div className="mb-6">
      <nav className="flex space-x-1 bg-white p-1 rounded-lg border border-slate-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Icon className="mr-2 h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
