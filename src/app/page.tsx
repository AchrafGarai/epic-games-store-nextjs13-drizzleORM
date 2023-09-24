import CheckoutButton from "@/components/CheckoutButton";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <div>
          <UserButton
            afterSignOutUrl="/"
            userProfileMode="navigation"
            userProfileUrl="/user-profile"
          />
        </div>
        Hello
        <br />
        {/* <CheckoutButton /> */}
        <Button>Button</Button>
      </div>
    </main>
  );
}
