import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CheckSquare, Zap, Target, Users, ArrowRight } from 'lucide-react';

const Landing = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <CheckSquare className="h-8 w-8" />,
      title: "Smart Task Management",
      description: "Create, organize, and track your tasks with intelligent prioritization and due date reminders."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast",
      description: "Built with modern React and optimized for speed. Get things done without waiting."
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Goal Focused",
      description: "Set priorities, track progress, and stay focused on what matters most to you."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Team Collaboration",
      description: "Work together with your team, assign tasks, and keep everyone aligned."
    }
  ];

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to TaskMaster!</h1>
          <p className="text-xl text-base-content/70 mb-8">You're already logged in.</p>
          <Link to="/dashboard" className="btn-gradient">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero min-h-screen gradient-primary">
        <div className="hero-content text-center text-white">
          <div className="max-w-4xl">
            <div className="mb-8 fade-in">
              <CheckSquare className="h-20 w-20 mx-auto mb-6 opacity-90" />
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 slide-up">
              TaskMaster
            </h1>
            <p className="text-xl sm:text-2xl mb-8 opacity-90 slide-up">
              The smart way to manage your tasks and boost productivity
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center scale-in">
              <Link to="/signup" className="btn btn-lg bg-white text-primary hover:bg-white/90 border-0">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/login" className="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-primary">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-spacing bg-base-100">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose TaskMaster?</h2>
            <p className="text-xl text-base-content/70">
              Everything you need to stay organized and productive
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300">
                <div className="card-body text-center">
                  <div className="text-primary mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="card-title justify-center mb-2">{feature.title}</h3>
                  <p className="text-base-content/70">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing gradient-secondary">
        <div className="container-custom text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Organized?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who have transformed their productivity with TaskMaster
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn btn-lg bg-white text-primary hover:bg-white/90 border-0">
              Start Your Free Account
            </Link>
            <Link to="/login" className="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-primary">
              Already Have Account?
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-base-300 py-8">
        <div className="container-custom text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CheckSquare className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">TaskMaster</span>
          </div>
          <p className="text-base-content/70">
            © 2024 TaskMaster. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;