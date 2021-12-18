import { Auth, Typography, Button } from '@supabase/ui';
import { supabase } from '@/utils/supabaseClient';

const Container = (props) => {
  const { user } = Auth.useUser();
  if (user)
    return (
      <>
        <Typography.Text>Signed in: {user.email}</Typography.Text>
        <Button block onClick={() => props.supabaseClient.auth.signOut()}>
          Sign out
        </Button>
      </>
    );
  return props.children;
};

export default function AuthBasic() {
  return (
    <div className="container mx-auto max-w-sm py-12">
      <Auth.UserContextProvider supabaseClient={supabase}>
        <Container supabaseClient={supabase}>
          <Auth supabaseClient={supabase} providers={['github']} />
        </Container>
      </Auth.UserContextProvider>
    </div>
  );
}
