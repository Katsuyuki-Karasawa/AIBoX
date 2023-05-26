import crypto from 'crypto';
import { supabase } from '@/hooks/supabase'


export const database = () => {
    const insertUser = async (email: string, password: string, userdata: { [key: string]: any }) => {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex')
        const { data, error } = await supabase
        .from('users')
        .insert([
            {
                user_id: userdata["user"]["id"],
                email: email,
                password_hash: hash,
                salt: salt,
                created_at: userdata["user"]["created_at"],
                last_login: userdata["user"]["identities"]["last_sign_in_at"],
                updated_at: userdata["user"]["updated_at"],
            },
            ]);

        if (error) {
            console.error(error);
            return;
            //errorコードの処理を
        }
    };
    
    const insertProfile = async (uid: string, account_id: string, display_name: string, description: string, created_at: string, updated_at: string) => {
        const id = await getID(uid)
        if (!id) return
        const { data, error } = await supabase
        .from('profile')
        .insert([
            {
                id: id[0].id,
                user_id: uid,
                account_id: account_id,
                display_name: display_name,
                description: description,
                created_at: created_at,
                updated_at: updated_at,
            },
            ]);

        console.log({data, error})
    };
    
    const getUserProfile = async (uid: string) => {
        const { data: profile, error } = await supabase
        .from('profile')
        .select()
        .eq('user_id', uid)
        return profile
    }

    const getID = async (uid: string) => {
        const { data: id, error } = await supabase
        .from('users')
        .select('id')
        .eq('user_id', uid)
        return id
    }

    const updateDob = async (id: string, dob: string) => {
        const { data, error } = await supabase
        .from('users')
        .update({ dob: dob })
        .eq('user_id', id)
    };

    const getActivated = async (id: string) => {
        const { data, error } = await supabase
        .from('users')
        .select('is_activated')
        .eq('user_id', id)
    return data?.[0]?.is_activated ?? false;
    };

    const setActivated = async(user_id: string) => {
        const { data, error } = await supabase
        .from('users')
        .update({ is_activated: true })
        .eq('user_id', user_id);
    }

    const changePassword = async (id: number, user_id: string, password: string) => {
        
    }
    return {
        insertUser,
        insertProfile,
        getUserProfile,
        updateDob,
        getActivated,
        setActivated
    };
}
