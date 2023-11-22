// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { OnCompleteInput } from '~/src/lex-v2/types';
import { resolveBotConfig } from '~/src/lex-v2/utils';
import { lexProvider } from '~/src/lex-v2/AWSLexV2Provider';
import {
	InteractionsValidationErrorCode,
	assertValidationError,
} from '~/src/errors';

export const onComplete = (input: OnCompleteInput): void => {
	const { botName, callback } = input;
	const botConfig = resolveBotConfig(botName);
	assertValidationError(
		!!botConfig,
		InteractionsValidationErrorCode.NoBotConfig,
		`Bot ${botName} does not exist.`,
	);
	lexProvider.onComplete(botConfig, callback);
};
