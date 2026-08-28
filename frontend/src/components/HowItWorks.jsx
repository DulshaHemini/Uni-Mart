import "../styles/HowItWorks.css";

export default function HowItWorks() {
const steps = [
{
number: "01",
title: "Browse Products",
description: "Explore products listed by students."
},
{
number: "02",
title: "Choose What You Need",
description: "Find affordable new or used products."
},
{
number: "03",
title: "Connect & Buy",
description: "Connect with the seller and complete your purchase."
}
];

return (
    <section className="how-it-works">

        <div className="how-container">

            <div className="how-header">
                <h2>How UniMart Works</h2>
                <p>
                    Buying and selling between students made simple.
                </p>
            </div>

            <div className="how-steps">

                {steps.map((step) => (
                    <div className="how-step" key={step.number}>

                        <div className="step-number">
                            {step.number}
                        </div>

                        <h3>{step.title}</h3>

                        <p>{step.description}</p>

                    </div>
                ))}

            </div>

        </div>

    </section>
);

}