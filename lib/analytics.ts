// Google Analytics & Tag Manager & Facebook Pixel Event Tracking Utility

declare global {
	interface Window {
		gtag?: (
			command: string,
			targetId: string | Date,
			config?: Record<string, any>
		) => void;
		dataLayer?: any[];
		fbq?: (...args: any[]) => void;
		_fbq?: (...args: any[]) => void;
	}
}

export type EventCategory =
	| "engagement"
	| "campaign"
	| "authentication"
	| "avatar"
	| "voting"
	| "quiz"
	| "navigation"
	| "upload"
	| "social"
	| "error"
	| "conversion";

export interface AnalyticsEvent {
	action: string;
	category: EventCategory;
	label?: string;
	value?: number;
	userId?: string;
	metadata?: Record<string, any>;
}

/**
 * Track a custom event to Google Analytics and Google Tag Manager
 */
export function trackEvent({
	action,
	category,
	label,
	value,
	userId,
	metadata = {},
}: AnalyticsEvent): void {
	try {
		// Google Analytics 4 event
		if (typeof window !== "undefined" && window.gtag) {
			window.gtag("event", action, {
				event_category: category,
				event_label: label,
				value: value,
				user_id: userId,
				...metadata,
			});
		}

		// Google Tag Manager dataLayer push
		if (typeof window !== "undefined" && window.dataLayer) {
			window.dataLayer.push({
				event: action,
				eventCategory: category,
				eventLabel: label,
				eventValue: value,
				userId: userId,
				timestamp: new Date().toISOString(),
				...metadata,
			});
		}

		// Log to console in development
		if (process.env.NODE_ENV === "development") {
			console.log("📊 Analytics Event:", {
				action,
				category,
				label,
				value,
				userId,
				metadata,
			});
		}
	} catch (error) {
		console.error("Analytics tracking error:", error);
	}
}

/**
 * Track a Facebook Pixel standard or custom event
 */
export function trackFBEvent(
	eventName: string,
	params?: Record<string, any>,
	isCustom = false
): void {
	try {
		if (typeof window !== "undefined" && window.fbq) {
			if (isCustom) {
				window.fbq("trackCustom", eventName, params);
			} else {
				window.fbq("track", eventName, params);
			}
		}
	} catch (error) {
		console.error("Facebook Pixel tracking error:", error);
	}
}

/**
 * Track page views
 */
export function trackPageView(url: string, title?: string): void {
	try {
		if (typeof window !== "undefined" && window.gtag) {
			window.gtag("event", "page_view", {
				page_path: url,
				page_title: title || document.title,
				page_location: window.location.href,
			});
		}

		if (typeof window !== "undefined" && window.dataLayer) {
			window.dataLayer.push({
				event: "pageview",
				page: {
					path: url,
					title: title || document.title,
					url: window.location.href,
				},
				timestamp: new Date().toISOString(),
			});
		}

		// Facebook Pixel — PageView on every route change
		trackFBEvent("PageView");
	} catch (error) {
		console.error("Page view tracking error:", error);
	}
}

/**
 * Track authentication events
 */
export const trackAuth = {
	otpRequested: (phone: string, method: "sms" | "whatsapp") => {
		trackEvent({
			action: "otp_requested",
			category: "authentication",
			label: method,
			metadata: { phone_partial: phone.slice(-4) },
		});
		// User initiates contact — they're starting the registration journey
		trackFBEvent("Contact");
	},

	otpVerified: (phone: string, method: "sms" | "whatsapp") => {
		trackEvent({
			action: "otp_verified",
			category: "authentication",
			label: method,
			metadata: { phone_partial: phone.slice(-4) },
		});
	},

	otpFailed: (phone: string, reason: string) => {
		trackEvent({
			action: "otp_failed",
			category: "authentication",
			label: reason,
			metadata: { phone_partial: phone.slice(-4) },
		});
	},

	registrationComplete: (userId: string) => {
		trackEvent({
			action: "registration_complete",
			category: "authentication",
			userId,
			metadata: { conversion: true },
		});
		// OTP verified = registration complete
		trackFBEvent("CompleteRegistration", { currency: "LKR", value: 0 });
	},
};

/**
 * Track campaign flow events
 */
export const trackCampaign = {
	stepStarted: (step: string, userId?: string) => {
		trackEvent({
			action: "campaign_step_started",
			category: "campaign",
			label: step,
			userId,
		});
		// First step started = user showing strong intent (Lead)
		if (step === "verify") {
			trackFBEvent("Lead");
		}
		// Campaign page viewed = ViewContent
		trackFBEvent("ViewContent", { content_name: `campaign_step_${step}`, content_category: "campaign" });
	},

	stepCompleted: (step: string, userId?: string) => {
		trackEvent({
			action: "campaign_step_completed",
			category: "campaign",
			label: step,
			userId,
		});
	},

	stepAbandoned: (step: string, timeSpent: number, userId?: string) => {
		trackEvent({
			action: "campaign_step_abandoned",
			category: "campaign",
			label: step,
			value: timeSpent,
			userId,
			metadata: { time_spent_seconds: timeSpent },
		});
	},

	formFieldFilled: (field: string, step: string) => {
		trackEvent({
			action: "form_field_filled",
			category: "campaign",
			label: `${step}_${field}`,
		});
	},

	profileCreated: (userId: string, gender: string, name: string) => {
		trackEvent({
			action: "profile_created",
			category: "campaign",
			userId,
			metadata: { gender, name_length: name.length },
		});
		// Profile setup complete = registration with status
		trackFBEvent("CompleteRegistration", { status: true, currency: "LKR", value: 0 });
	},
};

/**
 * Track avatar generation events
 */
export const trackAvatar = {
	uploadStarted: (userId: string, fileSize: number) => {
		trackEvent({
			action: "avatar_upload_started",
			category: "avatar",
			userId,
			metadata: { file_size_kb: Math.round(fileSize / 1024) },
		});
		// Uploading a photo = customizing their product (avatar)
		trackFBEvent("CustomizeProduct");
	},

	uploadCompleted: (userId: string, fileSize: number, duration: number) => {
		trackEvent({
			action: "avatar_upload_completed",
			category: "avatar",
			userId,
			value: duration,
			metadata: {
				file_size_kb: Math.round(fileSize / 1024),
				upload_duration_ms: duration,
			},
		});
	},

	uploadFailed: (userId: string, error: string) => {
		trackEvent({
			action: "avatar_upload_failed",
			category: "avatar",
			label: error,
			userId,
		});
	},

	generationStarted: (userId: string, gender: string) => {
		trackEvent({
			action: "avatar_generation_started",
			category: "avatar",
			userId,
			metadata: { gender },
		});
	},

	generationCompleted: (userId: string, duration: number) => {
		trackEvent({
			action: "avatar_generation_completed",
			category: "avatar",
			userId,
			value: duration,
			metadata: { generation_duration_seconds: duration },
		});
		// Avatar is ready — user has their product
		trackFBEvent("ViewContent", { content_name: "avatar_generated", content_category: "avatar" });
	},

	generationFailed: (userId: string, error: string) => {
		trackEvent({
			action: "avatar_generation_failed",
			category: "avatar",
			label: error,
			userId,
		});
	},

	statusPolled: (userId: string, attemptNumber: number) => {
		trackEvent({
			action: "avatar_status_polled",
			category: "avatar",
			userId,
			metadata: { poll_attempt: attemptNumber },
		});
	},
};

/**
 * Track quiz events
 */
export const trackQuiz = {
	started: (userId: string) => {
		trackEvent({
			action: "quiz_started",
			category: "quiz",
			userId,
		});
		// Starting quiz = customizing their avatar product
		trackFBEvent("CustomizeProduct");
	},

	questionAnswered: (
		userId: string,
		questionId: string,
		answerId: string,
		questionNumber: number
	) => {
		trackEvent({
			action: "quiz_question_answered",
			category: "quiz",
			label: questionId,
			userId,
			metadata: {
				answer_id: answerId,
				question_number: questionNumber,
			},
		});
	},

	completed: (userId: string, answers: Record<string, string>) => {
		trackEvent({
			action: "quiz_completed",
			category: "quiz",
			userId,
			metadata: { answers },
		});
	},

	submitted: (userId: string, flavor: string) => {
		trackEvent({
			action: "quiz_submitted",
			category: "quiz",
			userId,
			metadata: { selected_flavor: flavor },
		});
		// Quiz submitted = user has filled out a lead-gen form fully
		trackFBEvent("Lead", { currency: "LKR", value: 0 });
	},
};

/**
 * Track voting events
 */
export const trackVoting = {
	pageViewed: (filter: string, page: number) => {
		trackEvent({
			action: "voting_page_viewed",
			category: "voting",
			label: filter,
			metadata: { page_number: page },
		});
		// Vote gallery = content viewing page
		trackFBEvent("ViewContent", {
			content_name: "vote_gallery",
			content_category: "voting",
		});
	},

	searchPerformed: (query: string, resultsCount: number) => {
		trackEvent({
			action: "voting_search",
			category: "voting",
			value: resultsCount,
			metadata: { query_length: query.length, results_count: resultsCount },
		});
		// Standard Search event
		trackFBEvent("Search", { search_string: query });
	},

	filterChanged: (filter: string) => {
		trackEvent({
			action: "voting_filter_changed",
			category: "voting",
			label: filter,
		});
	},

	voteAttempted: (userId: string, targetPostId: string) => {
		trackEvent({
			action: "vote_attempted",
			category: "voting",
			userId,
			metadata: { target_post_id: targetPostId },
		});
	},

	voteSuccess: (userId: string, targetPostId: string) => {
		trackEvent({
			action: "vote_success",
			category: "voting",
			userId,
			metadata: { target_post_id: targetPostId, conversion: true },
		});
		// Successful vote = completed sign-up/lead action
		trackFBEvent("Lead", { currency: "LKR", value: 0 });
	},

	voteFailed: (userId: string, targetPostId: string, reason: string) => {
		trackEvent({
			action: "vote_failed",
			category: "voting",
			label: reason,
			userId,
			metadata: { target_post_id: targetPostId },
		});
	},

	postViewed: (postId: string, postNumber: number) => {
		trackEvent({
			action: "post_viewed",
			category: "voting",
			metadata: { post_id: postId, post_number: postNumber },
		});
	},

	shareClicked: (postId: string, platform: string) => {
		trackEvent({
			action: "post_share_clicked",
			category: "voting",
			label: platform,
			metadata: { post_id: postId },
		});
		// Share = custom event (no direct standard event maps)
		trackFBEvent("Share", { platform, content_id: postId }, true);
	},
};

/**
 * Track navigation and engagement
 */
export const trackNavigation = {
	menuOpened: () => {
		trackEvent({
			action: "menu_opened",
			category: "navigation",
		});
	},

	linkClicked: (linkText: string, href: string) => {
		trackEvent({
			action: "link_clicked",
			category: "navigation",
			label: linkText,
			metadata: { href },
		});
	},

	ctaClicked: (ctaText: string, location: string) => {
		trackEvent({
			action: "cta_clicked",
			category: "engagement",
			label: ctaText,
			metadata: { location },
		});
		// CTA click = user is taking initiative (Lead intent)
		trackFBEvent("Lead", { currency: "LKR", value: 0 });
	},

	scrollDepth: (percentage: number, page: string) => {
		trackEvent({
			action: "scroll_depth",
			category: "engagement",
			label: page,
			value: percentage,
			metadata: { depth_percentage: percentage },
		});
	},

	timeOnPage: (seconds: number, page: string) => {
		trackEvent({
			action: "time_on_page",
			category: "engagement",
			label: page,
			value: seconds,
			metadata: { duration_seconds: seconds },
		});
	},
};

/**
 * Track social sharing
 */
export const trackSocial = {
	shareAttempted: (platform: string, contentType: string) => {
		trackEvent({
			action: "share_attempted",
			category: "social",
			label: platform,
			metadata: { content_type: contentType },
		});
	},

	shareCompleted: (platform: string, contentType: string) => {
		trackEvent({
			action: "share_completed",
			category: "social",
			label: platform,
			metadata: { content_type: contentType },
		});
	},
};

/**
 * Track errors
 */
export const trackError = {
	apiError: (endpoint: string, status: number, message: string) => {
		trackEvent({
			action: "api_error",
			category: "error",
			label: endpoint,
			value: status,
			metadata: { status_code: status, error_message: message },
		});
	},

	clientError: (errorType: string, message: string, stack?: string) => {
		trackEvent({
			action: "client_error",
			category: "error",
			label: errorType,
			metadata: { error_message: message, stack_trace: stack },
		});
	},

	networkError: (endpoint: string) => {
		trackEvent({
			action: "network_error",
			category: "error",
			label: endpoint,
		});
	},
};

/**
 * Track conversion events
 */
export const trackConversion = {
	campaignCompleted: (userId: string, totalTime: number) => {
		trackEvent({
			action: "campaign_completed",
			category: "conversion",
			userId,
			value: totalTime,
			metadata: {
				total_time_seconds: totalTime,
				conversion_complete: true,
			},
		});
		// Full campaign completion = highest-value conversion
		trackFBEvent("CompleteRegistration", { status: true, currency: "LKR", value: 0 });
	},

	firstVoteCast: (userId: string) => {
		trackEvent({
			action: "first_vote_cast",
			category: "conversion",
			userId,
			metadata: { milestone: "first_vote" },
		});
		// First vote = engaged user action
		trackFBEvent("Lead", { currency: "LKR", value: 0 });
	},
};

/**
 * Server-Sent Events (SSE) tracking for long-running operations
 */
export const trackSSE = {
	connectionOpened: (endpoint: string, userId: string) => {
		trackEvent({
			action: "sse_connection_opened",
			category: "engagement",
			label: endpoint,
			userId,
			metadata: { connection_type: "sse" },
		});
	},

	messageReceived: (
		endpoint: string,
		messageType: string,
		userId: string,
		sequenceNumber: number
	) => {
		trackEvent({
			action: "sse_message_received",
			category: "engagement",
			label: `${endpoint}_${messageType}`,
			userId,
			metadata: {
				message_type: messageType,
				sequence: sequenceNumber,
				connection_type: "sse",
			},
		});
	},

	connectionClosed: (
		endpoint: string,
		userId: string,
		duration: number,
		messagesReceived: number
	) => {
		trackEvent({
			action: "sse_connection_closed",
			category: "engagement",
			label: endpoint,
			userId,
			value: duration,
			metadata: {
				duration_seconds: duration,
				total_messages: messagesReceived,
				connection_type: "sse",
			},
		});
	},

	connectionError: (endpoint: string, userId: string, error: string) => {
		trackEvent({
			action: "sse_connection_error",
			category: "error",
			label: endpoint,
			userId,
			metadata: { error_message: error, connection_type: "sse" },
		});
	},
};
