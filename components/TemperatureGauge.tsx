import { Thermometer } from "lucide-react";
import type { TemperatureIndex } from "@/types/analysis";

interface TemperatureGaugeProps {
  temperatureIndex: TemperatureIndex;
}

function temperatureColor(score: number): string {
  if (score < 30) return "#3B82F6";
  if (score < 50) return "#F59E0B";
  if (score < 70) return "#F97316";
  return "#EF4444";
}

export default function TemperatureGauge({ temperatureIndex }: TemperatureGaugeProps) {
  const { overallTemperature, factors, summary } = temperatureIndex;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Thermometer
            className="w-5 h-5"
            style={{ color: temperatureColor(overallTemperature) }}
          />
          <span className="text-sm font-semibold text-gray-900">온도 지수</span>
        </div>
        <span
          className="text-lg font-bold"
          style={{ color: temperatureColor(overallTemperature) }}
        >
          {overallTemperature}°
        </span>
      </div>

      <div className="w-full h-3 bg-gradient-to-r from-blue-400 via-amber-400 to-red-500 rounded-full overflow-hidden relative">
        <div
          className="absolute top-0 right-0 h-full bg-gray-100 rounded-r-full"
          style={{ width: `${100 - overallTemperature}%` }}
        />
      </div>

      <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>

      <div className="space-y-3">
        {factors.map((factor) => (
          <div key={factor.name} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700">{factor.name}</span>
              <span className="text-xs text-gray-500">{factor.score}</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${factor.score}%`,
                  backgroundColor: temperatureColor(factor.score),
                }}
              />
            </div>
            <p className="text-xs text-gray-500">{factor.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
