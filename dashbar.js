"use client";
import Nav from "react-bootstrap/Nav";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { arePayoutsEnabled } from "./serverActions/connectedAccountStripeSA";
import { isUserSubscribed } from "../../dashboard/currentPlans/serverAction/subscriptionSA";

const agentDashboardTabs = [
  {
    title: "Financials",
    path: "/dashboard/financials",
    eventKey: "/dashboard/financials",
  },
  { title: "Plans", path: "/dashboard/Plans1", eventKey: "/dashboard/plans1" },
  {
    title: "Data Plans",
    path: "/dashboard/Plans2",
    eventKey: "/dashboard/plans2",
  },
  {
    title: "Premium Dashboard",
    path: "/dashboard/aDashboard",
    eventKey: "/dashboard/aDashboard",
  },
];

const tabItems = [
  { title: "Dashboard", path: "/dashboard", eventKey: "/dashboard" },
];

const currentPlans = [
  {
    title: "CurrentPlans",
    path: "/dashboard/currentPlans",
    eventKey: "/dashboard/currentPlans",
  },
];

const createTabs = async function AddAgentTabs() {
  const isPayoutable = await arePayoutsEnabled();
  const hasPaidForService = await isUserSubscribed();

  console.log(
    "isPayoutable: ",
    isPayoutable,
    "haspaidtosubscribe",
    hasPaidForService
  )

  if (isPayoutable) {
    agentDashboardTabs.forEach((item) => {
      pushTabItem(item);
    });
  }

  if (hasPaidForService) {
    currentPlans.forEach((plan) => {
      pushTabItem(plan);
    });
  }
};

function pushTabItem(obj) {
  tabItems.push(obj);
}

createTabs();

function DashBar() {
  const router = useRouter();

  const pathname = usePathname();

  return (
    <Nav variant="tabs" defaultActiveKey="/dashboard" activeKey={`${pathname}`}>
      {tabItems.map((tabItem) => (
        <Nav.Item key={tabItem.path}>
          <Nav.Link
            onClick={() => router.refresh()}
            as={Link}
            href={tabItem.path}
            eventKey={tabItem.eventKey}
          >
            {tabItem.title}
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
}

export default DashBar;
