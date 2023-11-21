// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { authenticatedHandler } from '~/src/clients/handlers/authenticated';
import { composeServiceApi } from '~/src/clients/internal/composeServiceApi';
import { extendedEncodeURIComponent } from '~/src/clients/middleware/signing/utils/extendedEncodeURIComponent';
import {
	parseJsonBody,
	parseJsonError,
	parseMetadata,
} from '~/src/clients/serde';
import { Endpoint, HttpRequest, HttpResponse } from '~/src/clients/types';
import { AmplifyUrl } from '~/src/utils/amplifyUrl';

import { defaultConfig, getSharedHeaders } from './base';

import type {
	GetInAppMessagesCommandInput as GetInAppMessagesInput,
	GetInAppMessagesCommandOutput as GetInAppMessagesOutput,
} from './types';

export type { GetInAppMessagesInput, GetInAppMessagesOutput };

const getInAppMessagesSerializer = (
	{ ApplicationId = '', EndpointId = '' }: GetInAppMessagesInput,
	endpoint: Endpoint,
): HttpRequest => {
	const headers = getSharedHeaders();
	const url = new AmplifyUrl(endpoint.url);
	url.pathname = `v1/apps/${extendedEncodeURIComponent(
		ApplicationId,
	)}/endpoints/${extendedEncodeURIComponent(EndpointId)}/inappmessages`;

	return { method: 'GET', headers, url };
};

const getInAppMessagesDeserializer = async (
	response: HttpResponse,
): Promise<GetInAppMessagesOutput> => {
	if (response.statusCode >= 300) {
		const error = await parseJsonError(response);
		throw error;
	} else {
		const { InAppMessageCampaigns } = await parseJsonBody(response);

		return {
			InAppMessagesResponse: { InAppMessageCampaigns },
			$metadata: parseMetadata(response),
		};
	}
};

/**
 * @internal
 */
export const getInAppMessages = composeServiceApi(
	authenticatedHandler,
	getInAppMessagesSerializer,
	getInAppMessagesDeserializer,
	defaultConfig,
);
