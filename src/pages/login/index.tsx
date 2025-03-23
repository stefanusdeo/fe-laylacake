import LayoutAuth from "@/components/template/layoutAuth";
import FormLogin from "@/layout/login/formLogin";

export default function LoginPage() {
  return (
    <LayoutAuth restricted={true}>
      <FormLogin />
    </LayoutAuth>
  );
}
