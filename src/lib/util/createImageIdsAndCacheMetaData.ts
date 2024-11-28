import { api } from 'dicomweb-client';
import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';
import type DICOMwebClient from 'dicomweb-client/types/api';
import type { WADORSMetaData } from '@cornerstonejs/dicom-image-loader/types';


type ImageIdsAndCacheMetaData = {
	StudyInstanceUID: string;
	SeriesInstanceUID: string;
	SOPInstanceUID?: string | null;
	wadoRsRoot: string;
	client?: DICOMwebClient | null;
}
export async function createImageIdsAndCacheMetaData({
	StudyInstanceUID,
	SeriesInstanceUID,
	SOPInstanceUID= null,
	wadoRsRoot,
	client= null
}: ImageIdsAndCacheMetaData) {
	const SOP_INSTANCE_UID = '00080018';
	const SERIES_INSTANCE_UID = '0020000E';

	const studySearchOptions = {
		studyInstanceUID: StudyInstanceUID,
		seriesInstanceUID: SeriesInstanceUID
	};

	client = client ?? new api.DICOMwebClient({ url: wadoRsRoot as string, singlepart: true });
	const instances = await client.retrieveSeriesMetadata(studySearchOptions);
	const imageIds = instances.map((instanceMetaData) => {
		const SeriesInstanceUID = instanceMetaData[SERIES_INSTANCE_UID]?.Value?.[0];
		const SOPInstanceUIDToUse = SOPInstanceUID || instanceMetaData[SOP_INSTANCE_UID]?.Value?.[0];

		const prefix = 'wadors:';

		const imageId =
			prefix +
			wadoRsRoot +
			'/studies/' +
			StudyInstanceUID +
			'/series/' +
			SeriesInstanceUID +
			'/instances/' +
			SOPInstanceUIDToUse +
			'/frames/1';

		cornerstoneDICOMImageLoader.wadors.metaDataManager.add(imageId, instanceMetaData as WADORSMetaData);
		return imageId;
	});

	// we don't want to add non-pet
	// Note: for 99% of scanners SUV calculation is consistent bw slices

	return imageIds;
}
