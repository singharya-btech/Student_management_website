import { Area, AreaChart, ResponsiveContainer, Tooltip, CartesianGrid, XAxis, YAxis } from 'recharts'

export default function SimpleChart({data}){
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid opacity={0.08} vertical={false} />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
        <Tooltip contentStyle={{ background: '#0f172a', borderRadius: 18, border: 'none' }} itemStyle={{ color: '#fff' }} cursor={{ fill: 'rgba(124,58,237,0.08)' }} />
        <Area type="monotone" dataKey="value" stroke="#7C3AED" strokeWidth={3} fill="url(#chartGradient)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
