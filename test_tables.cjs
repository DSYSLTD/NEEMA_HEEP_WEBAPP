const { createClient } = require('@supabase/supabase-js');
const sb = createClient('https://xkigjrdvxnzvgpoubari.supabase.co', 'sb_publishable_0DmBbfMZLKF7Mh8Pyl9xPQ_qV0VYsVu');

async function inspectTables() {
  const targetTables = [
    'blog_articles', 'blog_comments', 'article_comments', 'categories', 'tags',
    'beneficiaries', 'beneficiary_lists',
    'leads',
    'individual_member_registrations', 'group_member_registrations', 'members',
    'sponsorship_requests', 'partnership_requests',
    'jobs', 'job_applications', 'volunteer_applications', 'newsletter_subscriptions',
    'user_profiles', 'custom_roles', 'roles', 'user_roles', 'role_permissions',
    'social_media_links', 'social_media',
    'audit_logs'
  ];

  console.log('--- Inspecting Table Status and Schema ---');
  for (const t of targetTables) {
    try {
      const { data, error } = await sb.from(t).select('*').limit(2);
      if (error) {
        console.log('[TABLE] ' + t + ': ERROR ' + error.code + ' - ' + error.message);
      } else {
        const cols = data && data.length > 0 ? Object.keys(data[0]) : 'Empty (table exists)';
        console.log('[TABLE] ' + t + ': OK - count sample: ' + (data ? data.length : 0) + ', cols: ' + JSON.stringify(cols));
      }
    } catch (e) {
      console.log('[TABLE] ' + t + ': EXCEPTION ' + e.message);
    }
  }
}

inspectTables();
