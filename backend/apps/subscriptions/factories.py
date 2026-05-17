import factory
from django.utils import timezone
from django.contrib.auth import get_user_model
from apps.subscriptions.models import Subscription

User = get_user_model()

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    username = factory.Sequence(lambda n: f"user{n}")
    email = factory.Sequence(lambda n: f"user{n}@example.com")
    first_name = factory.Faker("first_name")
    last_name = factory.Faker("last_name")
    
    @factory.post_generation
    def password(self, create, extracted, **kwargs):
        password = extracted if extracted else "password123"
        self.set_password(password)

class SubscriptionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Subscription

    user = factory.SubFactory(UserFactory)
    service_name = factory.Faker("company")
    email_sender = factory.Faker("email")
    monthly_cost = factory.Faker("pydecimal", left_digits=2, right_digits=2, positive=True)
    billing_frequency = "monthly"
    category = "other"
    first_detected_date = factory.LazyFunction(lambda: timezone.now().date())
    next_billing_date = factory.Faker("future_date")
    status = "active"
