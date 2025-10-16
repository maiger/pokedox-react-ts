type PokeStatsProps = {
  stats: {
    hp: string;
    attack: string;
    defence: string;
    s_attack: string;
    s_defence: string;
    speed: string;
  };
};

function PokeStats({ stats }: PokeStatsProps) {
  return (
    <div className="flex bg-amber-200 p-2 rounded-2xl">
      <div className="p-2">
        <div>HP: {stats.hp}</div>
        <div>ATT: {stats.attack}</div>
        <div>DEF: {stats.defence}</div>
      </div>
      <div className="p-2">
        <div>S. ATT: {stats.s_attack}</div>
        <div>S. DEF: {stats.s_defence}</div>
        <div>SPD: {stats.speed}</div>
      </div>
    </div>
  );
}

export default PokeStats;
