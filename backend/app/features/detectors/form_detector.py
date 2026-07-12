from bs4 import BeautifulSoup


class FormDetector:

    def detect(
        self,
        html: str
    ) -> dict:

        soup = BeautifulSoup(

            html,

            "lxml"

        )

        forms = soup.find_all("form")

        passwords = soup.find_all(

            "input",

            {"type": "password"}

        )

        emails = soup.find_all(

            "input",

            {"type": "email"}

        )

        hidden = soup.find_all(

            "input",

            {"type": "hidden"}

        )

        external = False

        for form in forms:

            action = form.get(

                "action",

                ""

            )

            if action.startswith("http"):

                external = True

                break

        return {

            "has_login_form": len(forms) > 0,

            "password_inputs": len(passwords),

            "email_inputs": len(emails),

            "hidden_inputs": len(hidden),

            "external_form_action": external

        }