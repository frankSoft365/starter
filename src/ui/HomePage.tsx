import { Route as homeArticleListRoute } from "@/routes/_app/_home";
import { Route as homeFeatureRoute } from "@/routes/_app/_home/feature";
import { useLocation, useNavigate } from "@tanstack/react-router";

export default function HomePage({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const location = useLocation();
    const isHomeArticleListRoute = location.pathname === homeArticleListRoute.to;
    const isHomeFeatureRoute = location.pathname === homeFeatureRoute.to

    return (
        <div className="w-full flex">
            <div className="lg:mx-20 w-2xl">
                <ul className="menu w-full bg-base-100 menu-horizontal border-b-2 border-base-300 mt-2">
                    <li>
                        <a className={isHomeArticleListRoute ? "menu-active" : ''} onClick={() => navigate({ to: homeArticleListRoute.to })}>
                            For you
                        </a>
                    </li>
                    <li>
                        <a className={isHomeFeatureRoute ? "menu-active" : ''} onClick={() => navigate({ to: homeFeatureRoute.to })}>
                            Feature
                        </a>
                    </li>
                </ul>
                {children}
            </div>
            <div className="hidden lg:inline-flex lg:grow lg:flex-col lg:p-12 lg:items-start gap-3 lg:border-l-2 lg:border-base-300">
                <div className="aura aura-rainbow">
                    <div className="card w-full bg-base-100 shadow-sm">
                        <div className="card-body">
                            <span className="badge badge-xs badge-warning">Most Popular</span>
                            <div className="flex justify-between">
                                <h2 className="text-3xl font-bold">Premium</h2>
                                <span className="text-xl">$29/mo</span>
                            </div>
                            <ul className="mt-6 flex flex-col gap-2 text-xs">
                                <li>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                    <span>High-resolution image generation</span>
                                </li>
                                <li>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                    <span>Customizable style templates</span>
                                </li>
                                <li>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                    <span>Batch processing capabilities</span>
                                </li>
                                <li>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                    <span>AI-driven image enhancements</span>
                                </li>
                                <li className="opacity-50">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                    <span className="line-through">Seamless cloud integration</span>
                                </li>
                                <li className="opacity-50">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                    <span className="line-through">Real-time collaboration tools</span>
                                </li>
                            </ul>
                            <div className="mt-6">
                                <button className="btn btn-primary btn-block">Subscribe</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}