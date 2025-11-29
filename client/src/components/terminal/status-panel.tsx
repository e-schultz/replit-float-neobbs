import React from "react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Activity, Server, Wifi, Shield, Database, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const mockData = Array.from({ length: 20 }, (_, i) => ({
  name: i,
  value: 20 + Math.random() * 60,
}));

export const StatusPanel = () => {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-4 border-l border-border pl-0 md:pl-6 border-t md:border-t-0 pt-6 md:pt-0 mt-6 md:mt-0">
      {/* Clock Widget */}
      <div className="border border-border bg-card/30 p-4">
        <div className="flex items-center justify-between mb-2 text-xs text-muted-foreground uppercase tracking-widest">
          <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> System Time</span>
          <span className="text-primary">ONLINE</span>
        </div>
        <div className="text-3xl md:text-4xl font-display text-foreground tracking-wider">
          {time.toLocaleTimeString('en-US', { hour12: false })}
        </div>
        <div className="text-sm text-secondary mt-1">
          {time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase()}
        </div>
      </div>

      {/* System Metrics */}
      <div className="border border-border bg-card/30 p-4 flex-1 min-h-[200px] flex flex-col">
        <div className="flex items-center justify-between mb-4 text-xs text-muted-foreground uppercase tracking-widest">
          <span className="flex items-center gap-2"><Activity className="w-3 h-3" /> Neural Load</span>
          <span className="text-accent">STABLE</span>
        </div>
        
        <div className="flex-1 w-full h-32 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockData}>
              <Bar dataKey="value" fill="hsl(var(--primary))" opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          <StatusItem icon={<Server className="w-4 h-4" />} label="Core System" value="98.4%" status="OK" color="text-primary" />
          <StatusItem icon={<Database className="w-4 h-4" />} label="Memory Banks" value="42 TB" status="OK" color="text-primary" />
          <StatusItem icon={<Wifi className="w-4 h-4" />} label="Uplink" value="12.4 Gbps" status="ACTIVE" color="text-accent" />
          <StatusItem icon={<Shield className="w-4 h-4" />} label="Firewall" value="Level 5" status="SECURE" color="text-secondary" />
        </div>
      </div>

      {/* Active Users / Nodes */}
      <div className="border border-border bg-card/30 p-4">
        <div className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Active Nodes</div>
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-2 w-full rounded-sm",
                Math.random() > 0.2 ? "bg-primary/60 animate-pulse" : "bg-muted"
              )} 
            />
          ))}
        </div>
        <div className="mt-2 text-right text-xs text-primary font-mono">
          CONNECTED: 8/12
        </div>
      </div>
    </div>
  );
};

const StatusItem = ({ icon, label, value, status, color }: any) => (
  <div className="flex items-center justify-between text-sm font-mono">
    <div className="flex items-center gap-3 text-muted-foreground">
      {icon}
      <span>{label}</span>
    </div>
    <div className="flex items-center gap-3">
      <span className="text-foreground">{value}</span>
      <span className={cn("text-xs px-1.5 py-0.5 border border-border bg-black/20", color)}>{status}</span>
    </div>
  </div>
);
