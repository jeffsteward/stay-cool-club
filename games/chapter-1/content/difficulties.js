export const difficulties = [
    {
        towerRate: () => rand(1.5, 2.5),
        towerScale: () => rand(0.10, 0.18),
        tofuRate: () => rand(5, 10),
        tofuDropDelay: 1.5,
        cloudDensity: () => randi(3)
    },
    {
        towerRate: () => rand(1.4, 2.4),
        towerScale: () => rand(0.14, 0.22),
        tofuRate: () => rand(4, 9),
        tofuDropDelay: 1.0,
        cloudDensity: () => randi(5)
    },
    {
        towerRate: () => rand(1.3, 2.3),
        towerScale: () => rand(0.18, 0.30),
        tofuRate: () => rand(3, 8),
        tofuDropDelay: 0.8,
        cloudDensity: () => randi(8)
    },
    {
        towerRate: () => rand(1.0, 2.0),
        towerScale: () => rand(0.20, 0.38),
        tofuRate: () => rand(2, 7),
        tofuDropDelay: 0.4,
        cloudDensity: () => randi(10)
    },
]