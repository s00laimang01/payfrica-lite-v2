import { useMediaQuery } from "@/hooks";
import React, { FC, useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { usePayfricaV2Store } from "@/lib/store.zustand";
import { Separator } from "./ui/separator";
import {
  BellRing,
  Box,
  Edit2,
  User,
  Wallet,
  Calendar,
  Camera,
  Copy,
} from "lucide-react";
import { cn, PayfricaLiteV2, payfricalitev2 } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { APP_CONSTANTS } from "@/lib/constant";
import { useAccountBalance, useWallet } from "@suiet/wallet-kit";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { toast } from "sonner";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

const BalanceCard: FC<{ from?: string; to?: string; amount?: number }> = ({
  from = "usdc",
  to = "naira",
  amount = 0,
}) => {
  const { address } = useWallet();

  const payfricalitev2 = new PayfricaLiteV2(address);

  const { data } = useQuery({
    queryKey: ["balance-exchange"],
    queryFn: () => payfricalitev2.calculateExchange(from, to, amount),
  });

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-3">
        <Image
          src={APP_CONSTANTS.VERCEL_AVATAR + `/${to}`}
          alt={to}
          className="rounded-full"
          width={35}
          height={35}
        />
        <div>
          <span className="font-medium text-gray-900">{to.toUpperCase()}</span>
          <p className="text-xs text-gray-500">{to}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-gray-900">
          {data?.exchangeRate || "0.00"} {to.toUpperCase()}
        </p>
      </div>
    </div>
  );
};

const General = () => {
  const { user, setShowAddEmailModal } = usePayfricaV2Store();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">General</h2>
        <p className="text-gray-600">
          Manage your account details and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Email Section */}
        <div className="group p-4 rounded-xl border border-gray-200 hover:border-primary/30 hover:bg-gray-50/50 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/15 transition-colors">
                <User size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">
                  Email Address
                </h3>
                <p className="text-sm text-gray-500">Your registered email</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {user?.email ? (
                <Badge variant="secondary" className="font-mono text-xs">
                  {payfricalitev2.truncateAddress(user?.email, 8, 12)}
                </Badge>
              ) : (
                "Add Email"
              )}

              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                onClick={() => setShowAddEmailModal?.(true)}
              >
                <Edit2 size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Wallet Address Section */}
        <div className="group p-4 rounded-xl border border-gray-200 hover:border-primary/30 hover:bg-gray-50/50 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/15 transition-colors">
                <Wallet size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">
                  Wallet Address
                </h3>
                <p className="text-sm text-gray-500">Your connected wallet</p>
              </div>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="font-mono text-xs">
                  {payfricalitev2.truncateAddress(user?.wallet)}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>{user?.wallet}</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Date Joined Section */}
        <div className="group p-4 rounded-xl border border-gray-200 hover:border-primary/30 hover:bg-gray-50/50 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/15 transition-colors">
                <Calendar size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Date Joined</h3>
                <p className="text-sm text-gray-500">Account created since</p>
              </div>
            </div>
            <Badge variant="outline" className="text-gray-600">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "January 15, 2024"}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
  const { user } = usePayfricaV2Store();
  const { balance = 0 } = useAccountBalance();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Profile</h2>
        <p className="text-gray-600">
          Customize your profile and view your balance
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="p-6 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent rounded-xl border border-gray-200">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-20 w-20 ring-2 ring-primary/20 ring-offset-2">
                <AvatarImage
                  src={APP_CONSTANTS.VERCEL_AVATAR + `/${user?.wallet}`}
                  alt="Profile"
                />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white text-xl font-semibold">
                  {payfricalitev2
                    .truncateAddress(user?.wallet)
                    .charAt(0)
                    ?.toUpperCase() ||
                    user?.email?.charAt(0)?.toUpperCase() ||
                    "U"}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {payfricalitev2.truncateAddress(user?.wallet) ||
                  "Anonymous User"}
              </h3>
              <p className="text-gray-600 mb-4 font-mono text-sm">
                {payfricalitev2.truncateAddress(user?.email, 10, 15)}
              </p>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(user?.wallet!);
                  toast.success("Address copied to clipboard");
                }}
                size="sm"
              >
                Copy Address <Copy />
              </Button>
            </div>
          </div>
        </div>

        {/* Wallet Balance Section */}
        <div className="p-6 rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Wallet size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Wallet Balance
              </h3>
              <p className="text-sm text-gray-600">Your current balance</p>
            </div>
          </div>

          <div className="space-y-4">
            <BalanceCard from="naira" to="usdc" amount={0} />

            <BalanceCard from="usdc" to="naira" amount={Number(balance)} />
          </div>

          <Separator className="my-4" />

          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Total Balance</span>
            <span className="text-2xl font-bold text-primary">
              {payfricalitev2.formatCurrency(Number(balance))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Notification = () => {
  const { user } = usePayfricaV2Store();
  const { address } = useWallet();

  const payfricalitev2 = new PayfricaLiteV2(address);

  const [notifications, setNotifications] = useState({
    email: user?.preference?.emailNotification || false,
    push: user?.preference?.pushNotification || false,
    marketing: user?.preference?.marketingNotifications || false,
  });

  const handleToggle = async (key: keyof typeof notifications) => {
    try {
      setNotifications((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));

      await payfricalitev2.updatePreference({
        emailNotification: notifications.email,
        marketingNotifications: notifications.marketing,
        pushNotification: notifications.push,
      });

      toast.success("Notification settings updated");
    } catch (error) {
      setNotifications((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
      toast.error("Failed to update notification settings");
    }
  };

  const notificationSettings = [
    {
      key: "email" as keyof typeof notifications,
      title: "Email Notifications",
      description: "Receive notifications via email",
      icon: "📧",
    },
    {
      key: "push" as keyof typeof notifications,
      title: "Push Notifications",
      description: "Receive push notifications in browser",
      icon: "🔔",
    },
    {
      key: "marketing" as keyof typeof notifications,
      title: "Marketing Updates",
      description: "Product updates and promotions",
      icon: "📢",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Notifications
        </h2>
        <p className="text-gray-600">Manage how you receive notifications</p>
      </div>

      <div className="space-y-4">
        {notificationSettings.map((setting) => (
          <div
            key={setting.key}
            className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-primary/30 hover:bg-gray-50/50 transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg text-lg">
                {setting.icon}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{setting.title}</h3>
                <p className="text-sm text-gray-500">{setting.description}</p>
              </div>
            </div>
            <Switch
              checked={notifications[setting.key]}
              onCheckedChange={() => handleToggle(setting.key)}
            />
          </div>
        ))}
      </div>

      <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
        <div className="flex items-start gap-3">
          <div className="text-amber-600 mt-0.5 text-lg">💡</div>
          <div>
            <h4 className="font-medium text-amber-900 mb-1">Security Tip</h4>
            <p className="text-sm text-amber-800">
              We recommend keeping security alerts enabled to protect your
              account from unauthorized access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Settings = () => {
  const isMobile = useMediaQuery("(max-width:767px)");
  const [activeView, setActiveView] = useState("1");
  const { showSettingsModal, setShowSettingsModal, user } = usePayfricaV2Store(
    (state) => state
  );

  const views = [
    {
      id: "1",
      icon: Box,
      label: "General",
    },
    {
      id: "2",
      icon: User,
      label: "Profile",
    },
    {
      id: "3",
      icon: BellRing,
      label: "Notification",
    },
  ];

  const _views: Record<string, any> = {
    "1": General,
    "2": Profile,
    "3": Notification,
  };

  const View = _views[activeView];

  if (isMobile) {
    return (
      <Drawer
        open={showSettingsModal}
        onClose={() => setShowSettingsModal?.(false)}
      >
        <DrawerContent className="max-h-[90vh] z-[999]">
          <DrawerTitle className="sr-only" />
          <DrawerHeader className="border-b border-gray-200">
            <DrawerTitle className="text-xl font-semibold text-gray-900">
              Settings
            </DrawerTitle>
          </DrawerHeader>

          <div className="p-4 overflow-y-auto">
            {/* Mobile Navigation */}
            <div className="flex gap-1 mb-6 p-1 bg-gray-100 rounded-xl">
              {views.map((view) => (
                <button
                  key={view.id}
                  onClick={() => setActiveView(view.id)}
                  className={cn(
                    "flex-1 flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-200",
                    activeView === view.id
                      ? "bg-white shadow-sm text-primary"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  )}
                >
                  <view.icon size={20} />
                  <span className="text-xs font-medium">{view.label}</span>
                </button>
              ))}
            </div>

            {/* Mobile Content */}
            <View />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog
      open={showSettingsModal}
      onOpenChange={() => setShowSettingsModal?.(false)}
    >
      <DialogContent className="md:max-w-4xl rounded-2xl p-0 overflow-hidden border-0 shadow-2xl">
        <DialogTitle className="sr-only" />
        <div className="w-full flex h-[650px]">
          <div className="w-[280px] h-full bg-gradient-to-br from-gray-50 to-gray-100/50 p-6 border-r border-gray-200">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Settings
              </h2>
              <p className="text-sm text-gray-600">
                Manage your account preferences
              </p>
            </div>

            <div className="space-y-2">
              {views.map((view) => (
                <button
                  key={view.id}
                  onClick={() => setActiveView(view.id)}
                  className={cn(
                    "w-full rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-all duration-200 text-left group",
                    activeView === view.id
                      ? "bg-white shadow-sm border border-gray-200 text-primary"
                      : "text-gray-700 hover:bg-white/70 hover:text-gray-900"
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-lg transition-all duration-200",
                      activeView === view.id
                        ? "bg-primary/10 text-primary"
                        : "bg-gray-200 text-gray-600 group-hover:bg-gray-300"
                    )}
                  >
                    <view.icon size={18} />
                  </div>
                  <span className="font-medium">{view.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 h-full overflow-y-auto bg-white">
            <div className="p-8">
              <View />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
