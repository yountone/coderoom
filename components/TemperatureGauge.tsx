import { Thermometer } from "lucide-react";
import type { TemperatureIndex } from "@/types/analysis";

interface TemperatureGaugeProps {
  temperatureIndex: TemperatureIndex;
}

function temperatureColor(score: number): string {
  if (score < 30) return "#3B82F6";
  if (score < 50) return "#F59E0B";
  if (score < 70) return "#FF7E36";
  return "#FA6616";
}

export default function TemperatureGauge({ temperatureIndex }: TemperatureGaugeProps) {
  const { overallTemperature, factors, summary } = temperatureIndex;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${temperatureColor(overallTemperature)}15` }}
          >
            <Thermometer
              className="w-4 h-4"
              style={{ color: temperatureColor(overallTemperature) }}
            />
          </div>
          <div>
            <span className="text-sm font-bold text-gray-900">온도 지수</span>
            <p className="text-xs text-gray-500">{overallTemperature}° / 100°</p>
          </div>
        </div>
        <span
          className="text-2xl font-bold"
          style={{ color: temperatureColor(overallTemperature) }}
        >
          {overallTemperature}°
        </span>
      </div>

      <div className="w-full h-3 bg-gradient-to-r from-blue-400 via-amber-400 to-carrot-500 rounded-full overflow-hidden relative">
        <div
          className="absolute top-0 right-0 h-full bg-gray-100 rounded-r-full"
          style={{ width: `${100 - overallTemperature}%` }}
        />
      </div>

      <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>

      <div className="space-y-3 pt-1 border-t border-gray-100">
        {factors.map((factor) => (
          <div key={factor.name} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-700">{factor.name}</span>
              <span className="text-xs font-medium text-gray-500">{factor.score}</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${factor.score}%`,
                  backgroundColor: temperatureColor(factor.score),
                }}
              />
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">{factor.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
