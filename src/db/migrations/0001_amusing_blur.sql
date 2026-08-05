CREATE TABLE "analytics_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"visitor_hash" text,
	"name" text NOT NULL,
	"path" text NOT NULL,
	"locale" text NOT NULL,
	"country" text,
	"value" integer
);
--> statement-breakpoint
ALTER TABLE "analytics_events" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "analytics_salts" (
	"day" date PRIMARY KEY NOT NULL,
	"salt" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "analytics_salts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "page_views" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"visitor_hash" text,
	"path" text NOT NULL,
	"locale" text NOT NULL,
	"country" text,
	"referrer_host" text,
	"device" text,
	"duration_ms" integer
);
--> statement-breakpoint
ALTER TABLE "page_views" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "retention_runs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "enquiries" ADD COLUMN "fill_duration_ms" integer;--> statement-breakpoint
ALTER TABLE "retention_runs" ADD COLUMN "views_anonymized" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "retention_runs" ADD COLUMN "events_anonymized" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "retention_runs" ADD COLUMN "salts_dropped" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE INDEX "analytics_events_name_idx" ON "analytics_events" USING btree ("name","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "analytics_events_visitor_idx" ON "analytics_events" USING btree ("visitor_hash","created_at") WHERE "analytics_events"."visitor_hash" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "page_views_created_at_idx" ON "page_views" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "page_views_path_idx" ON "page_views" USING btree ("path","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "page_views_visitor_idx" ON "page_views" USING btree ("visitor_hash","created_at") WHERE "page_views"."visitor_hash" IS NOT NULL;