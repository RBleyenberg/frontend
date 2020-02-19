import { Injectable } from '@angular/core';
import { Observable, of, Subject, throwError } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { IUser } from './user.model';
import swal from 'sweetalert2';

export interface Credentials {
    // Customize received credentials here
    username: string;
    token: string;
    role?: string;
}

export interface LoginContext {
    username: string;
    password: string;
    remember?: boolean;
}

export interface SignUpContext {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    remember?: boolean;
}

const credentialsKey = 'credentials';

const signIn = gql`
  mutation signIn($login: String!, $password: String!) {
    signIn(login: $login, password: $password) {
      token
    }
  }
`;

const signUp = gql`
  mutation signUp($firstName: String!, $lastName: String!, $email: String!, $username: String!, $password: String!) {
    signUp(firstName: $firstName, lastName: $lastName, email: $email, username: $username, password: $password) {
      token
    }
  }
`;

declare interface Me {
    me: IUser;
}

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private _credentials: Credentials | null;
    private _userIdentity: IUser;
    private authenticated = false;
    authenticationState = new Subject<any>();

    constructor(private apollo: Apollo, private router: Router) {
        const savedCredentials = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
        if (savedCredentials) {
            this._credentials = JSON.parse(savedCredentials);
            this.authenticationState.next(this._credentials);
        }
    }

    authenticate(identity: IUser) {
        this.authenticated = identity !== null;
    }

    identity(): Observable<IUser> {
        return this.apollo
            .watchQuery<Me>({
                query: gql`
          query me {
            me {
              id
              role {
                name
              }
              firstName
              lastName
              username
            }
          }
        `
            })
            .valueChanges.pipe(map(res => res.data.me));
    }

    login(context: LoginContext): Observable<Credentials | any> {
        const user = {
            username: context.username,
            token: '',
            remember: context.remember
        };

        return this.apollo
            .mutate({
                mutation: signIn,
                variables: {
                    login: context.username,
                    password: context.password
                }
            })
            .pipe(
                map(({ data }: any) => {
                    user.token = data.signIn.token;
                    this.setCredentials(user, context.remember);
                    this.apollo.getClient().resetStore();
                    return user;
                }),
                catchError(err => {
                    if (err.graphQLErrors) {
                        let error = null;

                        err.graphQLErrors.forEach((e: any) => {
                            error = {
                                message: e.extensions.exception.errors[0].message,
                                path: e.extensions.exception.errors[0].path,
                                type: e.extensions.exception.errors[0].type,
                                value: e.extensions.exception.errors[0].value
                            };
                        });

                        return throwError(error);
                    }
                    if (err.networkError) {
                        return throwError(err);
                    }
                })
            );
    }

    signUp(context: SignUpContext): Observable<Credentials | any> {
        const user = {
            username: context.username,
            token: '',
            remember: context.remember
        };

        return this.apollo.mutate({
                mutation: signUp,
                variables: {
                    firstName: context.firstName,
                    lastName: context.lastName,
                    email: context.email,
                    username: context.username,
                    password: context.password
                }
            }).pipe(
                map(({ data }: any) => {
                    user.token = data.signUp.token;
                    this.setCredentials(user, context.remember);
                    return user;
                }),
                catchError(err => {
                    if (err.graphQLErrors) {
                        let error = null;

                        err.graphQLErrors.forEach((e: any) => {
                            error = {
                                message: e.extensions.exception.errors[0].message,
                                path: e.extensions.exception.errors[0].path,
                                type: e.extensions.exception.errors[0].type,
                                value: e.extensions.exception.errors[0].value
                            };
                        });

                        return throwError(error);
                    }
                    if (err.networkError) {
                        return throwError(err);
                    }
                })
            );
    }

    logout(): Observable<boolean> {
        this.setCredentials();
        this.authenticate(null);
        this.apollo.getClient().resetStore();
        return of(true);
    }

    getToken(): string {
        // get the authentication token from local storage if it exists
        const lsCredentials: Credentials | null = JSON.parse(localStorage.getItem(credentialsKey));
        const ssCredentials: Credentials | null = JSON.parse(sessionStorage.getItem(credentialsKey));
        let token: string;

        if (!!lsCredentials) {
            token = lsCredentials.token;
        } else if (!!ssCredentials) {
            token = ssCredentials.token;
        }

        return token;
    }

    redirectLogoutOnSessionExpired() {
        this.router.navigate(['/access-denied']);
        swal
            .fire({
                title: 'Your session has expired. You will be automatically signed out.',
                timer: 3500,
                allowEscapeKey: false,
                allowOutsideClick: false,
                onOpen: () => {
                    swal.showLoading();
                }
            })
            .then(() => {
                this.logout().subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
            });
    }

    isAuthenticated(): boolean {
        return !!this.credentials;
    }

    hasAnyAuthority(authorities: string[], role: string): boolean {
        return this.hasAnyAuthorityDirect(authorities, role);
    }

    hasAnyAuthorityDirect(authorities: string[], role: string): boolean {
        if (!this.isAuthenticated()) {
            return false;
        }

        if (authorities.includes(role)) {
            return true;
        }

        return false;
    }

    get credentials(): Credentials | null {
        return this._credentials;
    }

    /**
     * Sets the users credentials.
     * The credentials may be persisted across sessions by setting the `remember` parameter to true.
     * Otherwise, the credentials are only persisted for the current session.
     */
    private setCredentials(credentials?: Credentials, remember?: boolean) {
        this._credentials = credentials || null;

        if (this._credentials) {
            const storage = remember ? localStorage : sessionStorage;
            storage.setItem(credentialsKey, JSON.stringify(this._credentials));
        } else {
            sessionStorage.removeItem(credentialsKey);
            localStorage.removeItem(credentialsKey);
        }

        this.authenticationState.next(this._credentials);
    }

    getAuthenticatedState(): Observable<any> {
        return this.authenticationState.asObservable();
    }
}