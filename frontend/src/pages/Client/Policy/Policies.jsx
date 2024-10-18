import React from "react";

const Policies = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Our Policies</h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Warranty Policy</h2>
        <p>
          Our warranty policy ensures that all products sold come with a
          guarantee against defects in materials and workmanship. If a product
          is found to be defective, we will repair or replace it at no cost to
          you, under the terms outlined in this policy.
        </p>
        <p>
          To request a warranty service, please provide proof of purchase and a
          description of the issue. Warranty claims must be submitted within the
          warranty period specified for each product.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Privacy Policy</h2>
        <p>
          We are committed to protecting your privacy. This policy outlines how
          we collect, use, and safeguard your personal information when you
          interact with our services.
        </p>
        <p>
          We collect personal data such as your name, email address, and payment
          information to facilitate transactions and improve your experience. We
          do not sell or share your information with third parties without your
          consent, except as required by law.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">
          Personal Data Collection & Processing Policy
        </h2>
        <p>
          This policy describes our practices regarding the collection,
          processing, and storage of personal data in compliance with applicable
          laws and regulations.
        </p>
        <p>
          We may collect data directly from you or through automated means when
          you use our website. Your data will be processed only for the purposes
          for which it was collected, and we take appropriate measures to ensure
          its security.
        </p>
        <p>
          You have the right to access, correct, or delete your personal data,
          and you can contact us at any time to exercise these rights.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Contact Us</h2>
        <p>
          If you have any questions or concerns regarding our policies, please
          feel free to contact us at [your email address] or through our contact
          form on the website.
        </p>
      </section>
    </div>
  );
};

export default Policies;
