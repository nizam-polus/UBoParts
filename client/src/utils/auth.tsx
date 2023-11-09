import { useRouter } from "next/router";

export function checkAuthentication() {
    const router = useRouter();

    const unauthRoutes = [
        '/', 
        '/homepage', 
        'shop', 
        'about_us_', 
        'request', 
        'dismantle_car', 
        'seller-registration', 
        'products_', 
        '404', 
        'email-verification', 
        'cookie', 
        'contact_us'
    ]
     const authenticatedRoute = !(!!unauthRoutes.find((ele) => ele.includes(router.pathname)));
        
    // Implement your authentication logic here
    if(!authenticatedRoute){ 
            return true 
    }
    // Return true if the user is authenticated, otherwise return false
    return false; // Replace with your actual authentication logic
}
