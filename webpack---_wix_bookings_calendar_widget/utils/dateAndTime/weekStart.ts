export type FirstDayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export function getFirstDayOfTheWeek(locale: string): FirstDayOfWeek {
  const parts = locale?.match(
    /^([a-z]{2,3})(?:-([a-z]{3})(?=$|-))?(?:-([a-z]{4})(?=$|-))?(?:-([a-z]{2}|\d{3})(?=$|-))?/i,
  );
  const [region, language] = [parts?.[4], parts?.[1]];
  const regionSat = 'AEAFBHDJDZEGIQIRJOKWLYOMQASDSY'.match(/../g);
  const regionSun =
    'AGARASAUBDBRBSBTBWBZCACNCODMDOETGTGUHKHNIDILINJMJPKEKHKRLAMHMMMOMTMXMZNINPPAPEPHPKPRPTPYSASGSVTHTTTWUMUSVEVIWSYEZAZW'.match(
      /../g,
    );
  const languageSat = ['ar', 'arq', 'arz', 'fa'];
  const languageSun =
    'amasbndzengnguhehiidjajvkmknkolomhmlmrmtmyneomorpapssdsmsnsutatethtnurzhzu'.match(
      /../g,
    );

  return region
    ? regionSun?.includes(region)
      ? 0
      : regionSat?.includes(region)
      ? 6
      : 1
    : languageSun?.includes(language!)
    ? 0
    : languageSat?.includes(language!)
    ? 6
    : 1;
}
