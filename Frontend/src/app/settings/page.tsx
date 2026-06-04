"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { User, Building2, Key, Shield, Copy, Plus, Trash2, Eye, EyeOff, Check } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { useAuthStore } from "@/stores/auth.store";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { settingsService } from "@/services/settings.service";
import { useQuery } from "@tanstack/react-query";
import { text } from "stream/consumers";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "organization", label: "Organization", icon: Building2 },
  { id: "api-keys", label: "API Keys", icon: Key },
  { id: "security", label: "Security", icon: Shield },
];

export default function SettingsPage() {
  const { user, currentOrg, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || "",
    username: user?.username || "",
    email: user?.email || "",
  });
  const [orgForm, setOrgForm] = useState({ name: currentOrg?.name || "" });
  const [saving, setSaving] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", new_pw: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);

  const {
    data:
    apiKeys = [],
    refetch:
    refetchKeys,
  } = useQuery({

    queryKey: [
      "api-keys"
    ],

    queryFn:
      async () => {

        return (
          await settingsService
            .getApiKeys()
        );
      },
  });

  const handleSaveProfile =
    async () => {

      setSaving(
        true
      );

      try {

        const response =

          await settingsService
            .updateProfile(
              profileForm
            );

        updateUser(
          response
        );

        toast.success(
          "Profile updated"
        );

      } catch {

        toast.error(
          "Failed to update profile"
        );

      } finally {

        setSaving(
          false
        );
      }
    };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
    toast.success("API key copied");
  };

  return (
    <AppLayout>
      <div className="max-w-3xl">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your account, organization, and API access
          </p>
        </motion.div>

        <div className="flex gap-6">
          {/* Sidebar tabs */}
          <nav className="w-44 shrink-0 space-y-0.5">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left",
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-card border border-border rounded-xl overflow-hidden"
            >
              {activeTab === "profile" && (
                <div>
                  <div className="px-6 py-4 border-b border-border">
                    <h2 className="text-sm font-semibold text-foreground">Profile Information</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    {/* Avatar */}
                    <div className="flex items-center gap-4 pb-4 border-b border-border">
                      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xl font-bold">
                        {(user?.full_name || user?.username || "U")[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{user?.full_name || user?.username}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                        <Button variant="outline" size="sm" className="mt-2">Change avatar</Button>
                      </div>
                    </div>
                    <Input label="Full Name" value={profileForm.full_name}
                      onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })} />
                    <Input label="Username" value={profileForm.username}
                      onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })} />
                    <Input label="Email" type="email" value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} />
                    <div className="flex justify-end pt-2">
                      <Button size="sm" loading={saving} onClick={handleSaveProfile}>Save changes</Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "organization" && (
                <div>
                  <div className="px-6 py-4 border-b border-border">
                    <h2 className="text-sm font-semibold text-foreground">Organization Settings</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <Input label="Organization Name" value={orgForm.name}
                      onChange={(e) => setOrgForm({ name: e.target.value })} />
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Plan</label>
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border">
                        <div>
                          <p className="text-sm font-semibold text-foreground capitalize">{currentOrg?.plan} Plan</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {currentOrg?.plan === "free" ? "5M events/month" :
                              currentOrg?.plan === "pro" ? "50M events/month" : "Unlimited"}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">Upgrade</Button>
                      </div>
                    </div>
                    <div className="flex justify-end pt-2">
                      <Button size="sm" loading={saving}
                        onClick={
                          async () => {

                            setSaving(
                              true
                            );

                            try {

                              await settingsService
                                .updateOrganization(
                                  orgForm
                                );

                              toast.success(
                                "Organization updated"
                              );

                            } catch {

                              toast.error(
                                "Failed to update organization"
                              );

                            } finally {

                              setSaving(
                                false
                              );
                            }
                          }}>
                        Save changes
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "api-keys" && (
                <div>
                  <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <h2 className="text-sm font-semibold text-foreground">API Keys</h2>
                    <Button size="sm" leftIcon={<Plus size={13} />}
                      onClick={
                        async () => {

                          const name =
                            prompt(
                              "Enter API key name"
                            );

                          if (!name)
                            return;

                          try {

                            await settingsService
                              .createApiKey({
                                name
                              });

                            toast.success(
                              "API key created"
                            );

                            refetchKeys();

                          } catch {

                            toast.error(
                              "Failed to create key"
                            );
                          }
                        }}>
                      Create key
                    </Button>
                  </div>
                  <div className="divide-y divide-border">
                    {apiKeys.map((k: {
                      id: number;
                      name: string;
                      key: string;
                      created_at: string;
                    }) => (
                      <div key={k.id} className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-foreground">{k.name}</p>
                            <p className="text-xs font-mono text-muted-foreground mt-0.5">{k.key}</p>
                            <div className="mt-2">
                              <span className="
                                                px-2
                                                py-1
                                                rounded
                                                text-[10px]
                                                font-medium
                                                bg-muted
                                                border
                                                border-border
                                                text-muted-foreground
                                              ">
                                Active API Key
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1.5">
                              Created {
                                new Date(
                                  k.created_at
                                ).toLocaleDateString()
                              }
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-muted transition-colors"
                              onClick={() => handleCopyKey(k.key)}
                            >
                              {copiedKey === k.key ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                              {copiedKey === k.key ? "Copied" : "Copy"}
                            </button>
                            <button
                              className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                              onClick={
                                async () => {

                                  try {

                                    await settingsService
                                      .revokeApiKey(
                                        k.id
                                      );

                                    toast.success(
                                      "API key revoked"
                                    );

                                    refetchKeys();

                                  } catch {

                                    toast.error(
                                      "Failed to revoke"
                                    );
                                  }
                                }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div>
                  <div className="px-6 py-4 border-b border-border">
                    <h2 className="text-sm font-semibold text-foreground">Security</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="space-y-1.5 relative">
                      <label className="text-sm font-medium text-foreground">Current Password</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={passwords.current}
                          onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                          className="w-full h-9 px-3 pr-10 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                          placeholder="Current password"
                        />
                        <button type="button" onClick={() => setShowPw(!showPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                    <Input label="New Password" type="password" value={passwords.new_pw}
                      onChange={(e) => setPasswords({ ...passwords, new_pw: e.target.value })}
                      placeholder="Min 8 characters" />
                    <Input label="Confirm New Password" type="password" value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      placeholder="Repeat new password" />
                    <div className="flex justify-end pt-2">
                      <Button size="sm" loading={saving}
                        onClick={
                          async () => {

                            if (
                              passwords.new_pw
                              !==
                              passwords.confirm
                            ) {

                              toast.error(
                                "Passwords do not match"
                              );

                              return;
                            }

                            setSaving(
                              true
                            );

                            try {

                              await settingsService
                                .changePassword({

                                  current_password:
                                    passwords.current,

                                  new_password:
                                    passwords.new_pw,
                                });

                              toast.success(
                                "Password updated"
                              );

                              setPasswords({

                                current: "",

                                new_pw: "",

                                confirm: "",
                              });

                            } catch {

                              toast.error(
                                "Password update failed"
                              );

                            } finally {

                              setSaving(
                                false
                              );
                            }
                          }}>
                        Update password
                      </Button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border">
                      <h3 className="text-sm font-semibold text-foreground mb-3">Sessions</h3>
                      <div className="space-y-2">
                        {["MacBook Pro · Chrome · Current session", "iPhone 14 · Safari · 2 days ago", "Windows PC · Edge · 5 days ago"].map((s, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <p className="text-xs text-foreground">{s}</p>
                            {i > 0 && (
                              <button className="text-xs text-destructive hover:underline"
                                onClick={() => toast.success("Session revoked")}>
                                Revoke
                              </button>
                            )}
                            {i === 0 && <span className="text-xs text-emerald-500 font-medium">Active</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
