type TourContent = { slug?: string | null; title?: string | null };

/** Keep unfinished editorial/test records out of public tour pickers and cards. */
export function isPublicTourContent(tour: TourContent): boolean {
  const marker = /(^|[^\p{L}\p{N}])(test|testing|demo|sample|placeholder|lorem|тест)([^\p{L}\p{N}]|$)/iu;
  return ![tour.slug, tour.title].some((value) => value && marker.test(value));
}
