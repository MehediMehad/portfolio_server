export interface TCreateSocialMediaBody {
    platformName: string;
    url: string;
    icon?: string; // optional
}

export interface TUpdateSocialMediaBody {
    SocialMediaId: string;
    platformName: string;
    url: string;
    icon?: string; // optional
}
