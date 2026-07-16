import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import AnimatedBackground from '../../components/layout/AnimatedBackground';

/**
 * Shared shell for /login and /signup.
 *
 * The card is four columns wide:
 *
 *      [ slot ][   form   ][ slot ]
 *         1        2   2       1        -> form : description = 2 : 1
 *
 * The FORM is placed dead centre (cols 2-3) and NEVER MOVES. No transform, no
 * transition, nothing. It is the thing you're typing into, so it stays put.
 *
 * The DESCRIPTION is a quarter-width panel and is the only animated element. It
 * slides between the two outer slots:
 *
 *      student  ->  [ desc ][   form   ][      ]     = [-1]
 *      company  ->  [      ][   form   ][ desc ]     = [1-]
 *
 * Sliding the form was the mistake in the last pass: moving the target while
 * someone is reaching for it is exactly the UX problem you flagged. Moving a
 * block of prose that nobody is interacting with costs nothing.
 *
 * Below md the description is hidden entirely and the form is a plain static
 * block. There's nothing to slide on a 390px screen.
 */
export default function AuthLayout({ description, descriptionSide = 'left', children }) {
  const onRight = descriptionSide === 'right';

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <AnimatedBackground />
      <Header />

      <main className="flex min-h-[calc(100vh-4rem)] flex-1 items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
        {/* The form gives the card its height (it's in normal flow); the description
            is absolute and stretches to fill. So the form can never scroll or be
            clipped — shrink the form, the card shrinks with it. */}
        <div className="relative w-full max-w-5xl md:grid md:grid-cols-4">
          {/* The description — the only moving part. `translate-x-[300%]` is 300% of
              its own width (a quarter of the card) = 75%, i.e. the last column. */}
          {description && (
            <aside
              className={`z-0 hidden md:absolute md:inset-y-0 md:left-0 md:flex md:w-1/4 md:flex-col md:justify-center md:p-6 md:transition-transform md:duration-500 md:ease-[cubic-bezier(.22,.61,.36,1)] ${
                onRight ? 'md:translate-x-[300%]' : 'md:translate-x-0'
              }`}
            >
              {description}
            </aside>
          )}

          {/* The form — centre two columns, static, and ABOVE the description.
              `relative z-10` is load-bearing: an absolutely-positioned sibling
              paints on top of a static one no matter the DOM order, so without it
              the description slid across the FRONT of the form. Now it passes
              behind. The opaque bg-raised is what actually hides it. */}
          <section className="relative z-10 rounded-2xl border border-line bg-raised p-6 shadow-sm sm:p-7 md:col-span-2 md:col-start-2">
            {children}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
