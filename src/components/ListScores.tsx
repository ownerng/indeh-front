import { useEffect } from "react";
import { ScoreCard } from "./ScoreCard";
import type { ScoreResponse } from "../types/global";
interface ListScoreProps {
  scores: ScoreResponse[];
  loading: boolean;
  error: string | null;
  fetchScores: () => Promise<void>;
}
export const ListScores = ({scores, loading, error, fetchScores}: ListScoreProps) => {

    useEffect(() => {
    }, [fetchScores]);


    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Listado de Asignaciones</h2>
                <div className="flex space-x-2">

                </div>
            </div>

            <div className="mt-6">
                {loading && <div className="text-center py-8 text-gray-500">Cargando Asignaciones...</div>}
                {error && <div className="text-center py-8 text-red-500">Error: {error}</div>}
                {!loading && !error && (
                    scores.length > 0 ? (
                        scores.map(sub => (
                            <ScoreCard key={sub.id} score={sub}  onUserAction={fetchScores}/>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No se encontraron Asignaciones
                        </div>
                    )
                )}
            </div>
        </div>
    );
}