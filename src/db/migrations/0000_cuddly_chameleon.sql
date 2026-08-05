CREATE TABLE "consent_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"consent_id" uuid NOT NULL,
	"action" text NOT NULL,
	"categories" jsonb NOT NULL,
	"policy_version" text NOT NULL,
	"locale" text NOT NULL,
	"ip_hash" text,
	"user_agent" text,
	"anonymized_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "consent_log" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "enquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"first_name" text,
	"last_name" text,
	"email" text,
	"phone" text,
	"message" text,
	"arrival" date,
	"departure" date,
	"guests" smallint,
	"locale" text NOT NULL,
	"source_path" text,
	"ip_hash" text,
	"user_agent" text,
	"status" text DEFAULT 'new' NOT NULL,
	"email_host_status" text DEFAULT 'pending' NOT NULL,
	"email_guest_status" text DEFAULT 'pending' NOT NULL,
	"anonymized_at" timestamp with time zone,
	CONSTRAINT "enquiries_identity_present" CHECK ("enquiries"."anonymized_at" IS NOT NULL OR (
        "enquiries"."first_name" IS NOT NULL AND
        "enquiries"."last_name" IS NOT NULL AND
        "enquiries"."email" IS NOT NULL AND
        "enquiries"."message" IS NOT NULL
      )),
	CONSTRAINT "enquiries_guests_range" CHECK ("enquiries"."guests" IS NULL OR ("enquiries"."guests" BETWEEN 1 AND 20)),
	CONSTRAINT "enquiries_locale_length" CHECK (char_length("enquiries"."locale") BETWEEN 2 AND 5)
);
--> statement-breakpoint
ALTER TABLE "enquiries" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "retention_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ran_at" timestamp with time zone DEFAULT now() NOT NULL,
	"enquiries_anonymized" integer DEFAULT 0 NOT NULL,
	"consents_anonymized" integer DEFAULT 0 NOT NULL,
	"duration_ms" integer DEFAULT 0 NOT NULL,
	"ok" boolean DEFAULT true NOT NULL,
	"error" text
);
--> statement-breakpoint
CREATE INDEX "consent_log_consent_id_idx" ON "consent_log" USING btree ("consent_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "consent_log_pending_anonymisation_idx" ON "consent_log" USING btree ("created_at") WHERE "consent_log"."anonymized_at" IS NULL;--> statement-breakpoint
CREATE INDEX "enquiries_created_at_idx" ON "enquiries" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "enquiries_pending_anonymisation_idx" ON "enquiries" USING btree ("created_at") WHERE "enquiries"."anonymized_at" IS NULL;--> statement-breakpoint
CREATE INDEX "enquiries_ip_hash_recent_idx" ON "enquiries" USING btree ("ip_hash","created_at" DESC NULLS LAST) WHERE "enquiries"."ip_hash" IS NOT NULL;