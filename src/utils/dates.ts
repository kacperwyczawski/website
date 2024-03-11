import { translate } from "@utils/localization";

export function dates(lang: string, dateStart: Date, dateEnd?: Date) {
	function formatDate(date: Date) {
		const year = date.getFullYear();
		const month = (date.getMonth() + 1).toString().padStart(2, "0");
		return `${year}.${month}`;
	}
	const formattedDateStart = formatDate(dateStart);
	const formattedDateEnd = dateEnd
		? formatDate(dateEnd)
		: translate("cv.present", lang);
	if (formattedDateStart === formattedDateEnd) return formattedDateStart;
	return `${formattedDateStart} - ${formattedDateEnd}`;
}
